import { findCodeNac } from "../../library/sderDB";
import { LabelStatus, UnIdentifiedDecisionTj } from "dbsder-api-types";

export async function computeRulesDecisionTj(
  decision: UnIdentifiedDecisionTj
): Promise<UnIdentifiedDecisionTj> {
  if (!decision.public)
    return {
      ...decision,
      labelStatus: LabelStatus.IGNORED_DECISION_NON_PUBLIQUE,
    };
  if (decision.originalTextZoning?.is_public === 0)
    return {
      ...decision,
      labelStatus: LabelStatus.IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE,
    };
  if (decision.debatPublic && decision.originalTextZoning?.is_public === 2)
    return {
      ...decision,
      labelStatus:
        LabelStatus.IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE,
    };

  const codeNac = await findCodeNac({ codeNAC:  decision.NACCode });

  if (!codeNac)
    return { ...decision, labelStatus: LabelStatus.IGNORED_CODE_NAC_INCONNU };
  if (!codeNac.indicateurDecisionRenduePubliquement)
    return {
      ...decision,
      labelStatus: LabelStatus.IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE,
    };
  if (!codeNac.categoriesToOmitTJ || !codeNac.blocOccultationTJ)
    return {
      ...decision,
      labelStatus: LabelStatus.IGNORED_BLOC_OCCULATION_NON_DEFINI,
    };
  if (decision.debatPublic && !codeNac.indicateurDebatsPublics)
    return {
      ...decision,
      labelStatus: LabelStatus.IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE,
    };

  const occultation = {
    ...decision.occultation,
    categoriesToOmit:
      codeNac.categoriesToOmitTJ[decision.recommandationOccultation],
  };
  const blocOccultation = codeNac.blocOccultationTJ;

  return {
    ...decision,
    occultation,
    blocOccultation,
  };
}
