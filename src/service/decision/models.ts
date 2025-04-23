import {
  UnIdentifiedDecisionDila,
  UnIdentifiedDecision,
  isUnIdentifiedDecision,
  isId,
  isSourceName,
  Decision,
  isLabelStatus,
  DecisionDila,
  LabelStatus,
  LabelTreatment,
  isLabelTreatment,
  PublishStatus,
  isPublishStatus,
} from "dbsder-api-types";
import { ObjectId } from "mongodb";
import { ZoningParameters } from "../../library/zoning";
import { notSupported } from "../../library/error";

export type DecisionSupported = Exclude<Decision, DecisionDila> & {
  originalText: string; // Warn: current model accept empty but it's wrong
};

export type UnIdentifiedDecisionSupported = Exclude<
  UnIdentifiedDecision,
  UnIdentifiedDecisionDila
> & { originalText: string }; /// Warn: current model accept empty but it's wrong

function hasOriginalText(
  x: UnIdentifiedDecision
): x is UnIdentifiedDecision & { originalText: string } {
  return typeof x.originalText === "string" && !!x.originalText;
}

export function parseUnIdentifiedDecisionSupported(
  x: any
): UnIdentifiedDecisionSupported {
  const decision = isUnIdentifiedDecision(x);
  if (decision.sourceName === "dila")
    throw notSupported("decision.sourceName", decision.sourceName, new Error());
  if (!hasOriginalText(decision))
    throw notSupported(
      "decision.originalText",
      decision.originalText,
      new Error("originalText in decision is missing")
    );
  return decision;
}

export function parseId(maybeId: any): ObjectId {
  if (!isId(maybeId))
    throw notSupported("id", maybeId, new Error(`Given ID is not a valid ID`));
  return new ObjectId(maybeId);
}

function parseDate(x: any): Date {
  if (typeof x !== "string" || !/\d{4}-\d{2}-\d{2}/.test(x))
    throw notSupported(
      "date",
      x,
      new Error("Date should be at format: yyyy-mm-dd")
    );
  const date = new Date();
  date.setFullYear(parseInt(x.slice(0, "yyyy".length)));
  date.setMonth(parseInt(x.slice("yyyy-".length, "mm".length)) - 1);
  date.setDate(parseInt(x.slice("yyyy-mm-".length, "dd".length)));
  return date;
}

export type DecisionListFilters = {
  sourceName?: Decision["sourceName"];
  labelStatus?: Decision["labelStatus"];
  sourceId?: Decision["sourceId"];
  startDate?: Date;
  endDate?: Date;
  dateType: "dateDecision" | "dateCreation";
};
export function parseDecisionListFilters(x: any = {}): DecisionListFilters {
  const {
    sourceName,
    labelStatus,
    sourceId,
    startDate,
    endDate,
    dateType = "dateDecision",
  } = x;
  if (sourceName && !isSourceName(sourceName))
    throw notSupported("sourceName", sourceName, new Error());
  if (labelStatus && !isLabelStatus(labelStatus))
    throw notSupported("labelStatus", labelStatus, new Error());
  if (
    sourceId &&
    (typeof sourceId !== "string" || typeof sourceId !== "number")
  )
    throw notSupported("sourceId", sourceId, new Error());
  if (
    typeof dateType !== "string" ||
    (dateType !== "dateDecision" && dateType !== "dateCreation")
  )
    throw notSupported(
      "dateType",
      dateType,
      new Error("dateType should be dateDecision or dateCreation")
    );

  return {
    sourceName,
    labelStatus,
    sourceId,
    startDate: startDate && parseDate(startDate),
    endDate: startDate && parseDate(endDate),
    dateType,
  };
}

export type UpdatableDecisionFields = {
  labelStatus?: LabelStatus;
  publishStatus?: PublishStatus;
  pseudoText?: string;
  labelTreatments?: LabelTreatment[];
};
export function parseUpdatableDecisionFields(
  x: any = {}
): UpdatableDecisionFields {
  const { labelStatus, pseudoText, labelTreatments, publishStatus } = x;
  if (labelStatus && !isLabelStatus(labelStatus))
    throw notSupported("labelStatus", labelStatus, new Error());
  if (publishStatus && !isPublishStatus(publishStatus))
    throw notSupported("publishStatus", publishStatus, new Error());
  if (pseudoText && typeof pseudoText !== "string")
    throw notSupported(
      "pseudoText",
      pseudoText,
      new Error("pseudoText should be a string")
    );
  if (
    labelTreatments &&
    (!Array.isArray(labelTreatments) ||
      !labelTreatments.every(isLabelTreatment))
  )
    throw notSupported("labelTreatments", labelTreatments, new Error());

  return {
    labelStatus,
    labelTreatments,
    pseudoText,
    publishStatus,
  };
}

function mapDecisionIntoZoningSource(
  decision: UnIdentifiedDecisionSupported
): ZoningParameters["source"] {
  switch (decision.sourceName) {
    case "jurica":
      return "ca";
    case "juritj":
      return "tj";
    case "jurinet":
      return "cc";
  }
}

export function mapDecisionIntoZoningParameters(
  decision: UnIdentifiedDecisionSupported
): ZoningParameters {
  return {
    arret_id: decision.sourceId,
    source: mapDecisionIntoZoningSource(decision),
    text: decision.originalText,
  };
}

export function mapDecisionIntoUniqueFilters(
  decision: UnIdentifiedDecisionSupported
): Partial<UnIdentifiedDecision> {
  // Warn: should "sourceId" define unicity ? What's a sourceId for a TJ or a TCOM ?
  return { sourceName: decision.sourceName, sourceId: decision.sourceId };
}

type DateFilters =
  | { dateDecision: { $gte: string; $lte: string } }
  | { dateCreation: { $gte: string; $lte: string } }
  | {};
export function mapDecisionListFiltersIntoDbFilters(
  filters: DecisionListFilters
): {
  sourceName?: Decision["sourceName"];
  labelStatus?: Decision["labelStatus"];
  sourceId?: Decision["sourceId"];
} & DateFilters {
  const { startDate, endDate, dateType, ...filtersOnEqual } = filters;
  const dateFilter: DateFilters =
    startDate && endDate
      ? {
          [dateType]: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString(),
          },
        }
      : startDate
      ? {
          [dateType]: {
            $gte: startDate.toISOString(),
            $lte: new Date().toISOString(),
          },
        }
      : endDate
      ? {
          [dateType]: {
            $gte: new Date().toISOString(),
            $lte: endDate.toISOString(),
          },
        }
      : {};

  return {
    ...filtersOnEqual,
    ...dateFilter,
  };
}
