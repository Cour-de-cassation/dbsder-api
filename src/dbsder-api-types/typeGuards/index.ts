import {
  DecisionTcom,
  parseDecisionTcom,
  parsePartialDecisionTcom,
  UnIdentifiedDecisionTcom
} from './decisions_tcom.zod'
import {
  DecisionTj,
  parseDecisionTj,
  parsePartialDecisionTj,
  UnIdentifiedDecisionTj
} from './decisions_tj.zod'
import {
  DecisionCa,
  parseDecisionCa,
  parsePartialDecisionCa,
  UnIdentifiedDecisionCa
} from './decisions_ca.zod'
import {
  DecisionCc,
  parseDecisionCc,
  parsePartialDecisionCc,
  UnIdentifiedDecisionCc
} from './decisions_cc.zod'
import {
  DecisionCph,
  parseDecisionCph,
  parsePartialDecisionCph,
  UnIdentifiedDecisionCph
} from './decisions_cph.zod'
import {
  DecisionDila,
  parseDecisionDila,
  parsePartialDecisionDila,
  UnIdentifiedDecisionDila
} from './decisions_dila.zod'
import {
  DecisionCaV2,
  parseDecisionCaV2,
  parsePartialDecisionCaV2,
  UnIdentifiedDecisionCaV2
} from './decisions_cav2.zod'

import { Origin, zObjectId, DbsderId, parseOrigin } from './common.zod'
import { ZodError } from 'zod'

export {
  parseDecisionTj,
  hasSourceNameTj,
  DecisionTj,
  UnIdentifiedDecisionTj
} from './decisions_tj.zod'
export {
  parseDecisionCa,
  hasSourceNameCa,
  DecisionCa,
  UnIdentifiedDecisionCa
} from './decisions_ca.zod'
export {
  parseDecisionCc,
  hasSourceNameCc,
  UnIdentifiedDecisionCc,
  DecisionCc
} from './decisions_cc.zod'
export {
  parseDecisionDila,
  hasSourceNameDila,
  DecisionDila,
  UnIdentifiedDecisionDila
} from './decisions_dila.zod'
export {
  parseDecisionCph,
  hasSourceNameCph,
  DecisionCph,
  UnIdentifiedDecisionCph
} from './decisions_cph.zod'
export {
  parseDecisionTcom,
  hasSourceNameTcom,
  DecisionTcom,
  UnIdentifiedDecisionTcom,
  JusticeFunctionTcom,
  JusticeRoleTcom
} from './decisions_tcom.zod'
export {
  parseDecisionCaV2,
  hasSourceNameCaV2,
  DecisionCaV2,
  UnIdentifiedDecisionCaV2
} from './decisions_cav2.zod'

export {
  LabelStatus,
  parseLabelStatus,
  LabelTreatments,
  parseLabelTreatments,
  PublishStatus,
  parsePublishStatus,
  isCurrentZoning,
  CurrentZoning,
  parseCurrentZoning,
  SuiviOccultation,
  Category,
  Entity,
  ZoneRange,
  Check,
  NLPVersion,
  NLPVersionDetails,
  ModelName,
  Occultation,
  QualitePartie,
  TypePartie,
  ZoningZone,
  Zoning,
  IntroductionSubzonageJurica,
  IntroductionSubzonageJurinet,
  SentenceIndex,
  QualitePartieExhaustive,
  TypePartieExhaustive,
  BlocOccultation,
  LabelRoute,
  RaisonInteretParticulier,
  parseRaisonInteretParticulier,
  DecisionsPubliques,
  DebatsPublics,
  DbsderId,
  Origin,
  parseOrigin
} from './common.zod'
export {
  parseAffaire,
  parsePartialAffaire,
  Affaire,
  UnIdentifiedAffaire,
  ReplacementTerm
} from './affaires.zod'
export { CategorieCodeDecision, CodeDecision } from './codeDecisions.zod'
export { CodeNac, CategoriesToOmit, parsePartialCodeNac } from './codeNacs.zod'
export {
  DocumentAssocie,
  UnIdentifiedDocumentAssocie,
  parseDocumentAssocie,
  parsePartialDocumentAssocie
} from './documentsAssocies.zod'
export { ZodError as ParseError } from 'zod'

export type Decision =
  | DecisionTj
  | DecisionTcom
  | DecisionCa
  | DecisionCc
  | DecisionDila
  | DecisionCph
  | DecisionCaV2
export type UnIdentifiedDecision =
  | UnIdentifiedDecisionTj
  | UnIdentifiedDecisionTcom
  | UnIdentifiedDecisionCa
  | UnIdentifiedDecisionCc
  | UnIdentifiedDecisionDila
  | UnIdentifiedDecisionCph
  | UnIdentifiedDecisionCaV2

export function parseId(x: unknown): DbsderId {
  return zObjectId.parse(x)
}

export function parseUnIdentifiedDecision(x: unknown): UnIdentifiedDecision {
  const isValidX = typeof x === 'object' && x != null && 'sourceName' in x
  if (!isValidX) throw new Error('There is no sourceName in decision')

  const sourceName = parseOrigin(x.sourceName)

  switch (sourceName) {
    case Origin.JURINET:
      return parseDecisionCc(x)
    case Origin.JURICA:
      return parseDecisionCa(x)
    case Origin.JURITJ:
      return parseDecisionTj(x)
    case Origin.DILA:
      return parseDecisionDila(x)
    case Origin.JURITCOM:
      return parseDecisionTcom(x)
    case Origin.PORTALIS_CPH:
      return parseDecisionCph(x)
    case Origin.JURICA_V2:
      return parseDecisionCaV2(x)
    default:
      sourceName satisfies never
      throw new Error('unexpected error')
  }
}

export function parsePartialDecision(
  sourceName: Decision['sourceName'],
  x: unknown
):
  | Partial<DecisionCc>
  | Partial<DecisionCa>
  | Partial<DecisionDila>
  | Partial<DecisionTcom>
  | Partial<DecisionTj>
  | Partial<DecisionCph>
  | Partial<DecisionCaV2> {
  switch (sourceName) {
    case Origin.JURINET:
      return parsePartialDecisionCc(x)
    case Origin.JURICA:
      return parsePartialDecisionCa(x)
    case Origin.JURITJ:
      return parsePartialDecisionTj(x)
    case Origin.DILA:
      return parsePartialDecisionDila(x)
    case Origin.JURITCOM:
      return parsePartialDecisionTcom(x)
    case Origin.PORTALIS_CPH:
      return parsePartialDecisionCph(x)
    case Origin.JURICA_V2:
      return parsePartialDecisionCaV2(x)
    default:
      sourceName satisfies never
      throw new Error('unexpected error')
  }
}

export function parseDecision(x: unknown): Decision {
  const isValidX = typeof x === 'object' && !!x && '_id' in x
  if (!isValidX) throw new Error('There is no _id in decision')

  const _id = parseId(x._id)
  const decision = parseUnIdentifiedDecision(x)

  return { _id, ...decision }
}

export function stringifyError(error: ZodError): string {
  return error._zod.def.map((_) => `${_.path.join('.')}: ${_.message}`).join('\n')
}
