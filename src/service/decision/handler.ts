import {
  CodeNac,
  Decision,
  DecisionDila,
  hasSourceNameTj,
  LabelStatus,
  PublishStatus,
} from "dbsder-api-types";
import { fetchZoning } from "../../library/zoning";
import {
  DecisionListFilters,
  DecisionSupported,
  mapDecisionIntoUniqueFilters,
  mapDecisionIntoZoningParameters,
  mapDecisionListFiltersIntoDbFilters,
  UnIdentifiedDecisionSupported,
  UpdatableDecisionFields,
} from "./models";
import { computeRulesDecisionTj } from "./rulesTj";
import {
  findCodeNac,
  findDecision,
  findDecisions,
  findAndUpdateDecision,
  findAndUpdateDecisionFields,
} from "../../library/sderDB";
import { logger } from "../../library/logger";
import { notFound } from "../../library/error";

function computeDates(
  previousDecision: Exclude<Decision, DecisionDila> | null
) {
  const now = new Date();
  return {
    firstImportDate: previousDecision
      ? previousDecision.firstImportDate ?? undefined
      : now.toISOString(),
    lastImportDate: now.toISOString(),
    publishDate: previousDecision?.publishDate ?? null,
    unpublishDate: previousDecision?.unpublishDate ?? null,
  };
}

async function computeZoning(
  decision: UnIdentifiedDecisionSupported
): Promise<UnIdentifiedDecisionSupported["originalTextZoning"]> {
  try {
    const zoning = await fetchZoning(mapDecisionIntoZoningParameters(decision));
    return zoning;
  } catch (err) {
    logger.warn({
      operationName: "Compute zoning",
      msg: "Zoning has failed and fallback into undefined",
      err,
    });
    return undefined;
  }
}

export async function saveDecision(
  decision: UnIdentifiedDecisionSupported
): Promise<Decision> {
  const uniqueFilters = mapDecisionIntoUniqueFilters(decision);
  const previousDecision = (await findDecision(uniqueFilters)) as Exclude<
    Decision,
    DecisionDila
  >; // decision cannot coming from dila
  const { firstImportDate, unpublishDate, publishDate, lastImportDate } =
    computeDates(previousDecision);

  const originalTextZoning = await computeZoning(decision);

  const decisionWithRules = hasSourceNameTj(decision)
    ? await computeRulesDecisionTj(decision)
    : decision;

  const decisionNormalized: UnIdentifiedDecisionSupported = {
    ...decisionWithRules,
    firstImportDate,
    lastImportDate,
    publishDate,
    unpublishDate,
    originalTextZoning,
    publishStatus:
      decisionWithRules.labelStatus !== LabelStatus.TOBETREATED
        ? PublishStatus.BLOCKED
        : PublishStatus.TOBEPUBLISHED,
  };

  const res = await findAndUpdateDecision(
    mapDecisionIntoUniqueFilters(decisionNormalized),
    decisionNormalized
  );

  logger.warn({
    operationName: "Insert in Sder Decision",
    msg: "Decision will not be treated",
    decision: {
      _id: res._id,
      labelStatus: res.labelStatus,
      publishStatus: res.publishStatus,
    },
  });

  return res;
}

export async function updateDecision(
  targetId: Decision["_id"],
  updateFields: UpdatableDecisionFields
) {
  return findAndUpdateDecisionFields({ _id: targetId }, updateFields);
}

export async function fetchDecisionById(
  decisionId: Decision["_id"]
): Promise<Decision> {
  const decision = await findDecision({ _id: decisionId });
  if (!decision) throw notFound("decision", new Error());
  return decision;
}

export async function fetchCodeNacById(
  codeNacId: CodeNac["_id"]
): Promise<CodeNac> {
  const codeNac = await findCodeNac({ _id: codeNacId });
  if (!codeNac) throw notFound("codeNac", new Error());
  return codeNac;
}

export async function fetchDecisions(
  filters: DecisionListFilters
): Promise<Decision[]> {
  return findDecisions(mapDecisionListFiltersIntoDbFilters(filters));
}

// Warn: probable Label responsability -
export async function updateDecisionForLabel(
  targetId: Decision["_id"],
  updateFields: Omit<UpdatableDecisionFields, "labelStatus" | "publishStatus">
) {
  const originalDecision = (await findDecision({
    _id: targetId,
  })) as DecisionSupported | null;
  if (!originalDecision) throw notFound("original decision", new Error());

  const labelStatus = LabelStatus.DONE;
  const publishStatus =
    originalDecision.publishStatus === PublishStatus.BLOCKED
      ? PublishStatus.BLOCKED
      : PublishStatus.TOBEPUBLISHED;

  const originalTreatments = originalDecision?.labelTreatments ?? [];
  const updatedLabelTreatments = updateFields.labelTreatments
    ? [
        ...originalTreatments,
        ...updateFields.labelTreatments.map(({ order, ..._ }) => ({
          ..._,
          order: originalTreatments.length + order,
        })),
      ]
    : originalTreatments;

  return findAndUpdateDecisionFields(
    { _id: targetId },
    {
      ...updateFields,
      labelTreatments: updatedLabelTreatments,
      labelStatus,
      publishStatus,
    }
  );
}
