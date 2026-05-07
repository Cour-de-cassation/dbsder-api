import {
  DecisionTcom,
  decisionTcomSchema,
  parseDecisionTcom,
  parsePartialDecisionTcom,
  UnIdentifiedDecisionTcom
} from './decisions_tcom.zod'
import {
  DecisionTj,
  decisionTjSchema,
  parseDecisionTj,
  parsePartialDecisionTj,
  UnIdentifiedDecisionTj
} from './decisions_tj.zod'
import {
  DecisionCa,
  decisionCaSchema,
  parseDecisionCa,
  parsePartialDecisionCa,
  UnIdentifiedDecisionCa
} from './decisions_ca.zod'
import {
  DecisionCc,
  decisionCcSchema,
  parseDecisionCc,
  parsePartialDecisionCc,
  UnIdentifiedDecisionCc
} from './decisions_cc.zod'
import {
  DecisionCph,
  decisionCphSchema,
  parseDecisionCph,
  parsePartialDecisionCph,
  UnIdentifiedDecisionCph
} from './decisions_cph.zod'
import {
  DecisionDila,
  decisionDilaSchema,
  parseDecisionDila,
  parsePartialDecisionDila,
  UnIdentifiedDecisionDila
} from './decisions_dila.zod'

import { zObjectId, DbsderId } from './common.zod'
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
  IntroductionSubzonageJurica,
  IntroductionSubzonageJurinet,
  SentenceIndex,
  QualitePartieExhaustive,
  TypePartieExhaustive,
  BlocOccultation,
  LabelRoute,
  RaisonInteretParticulier,
  DecisionsPubliques,
  DebatsPublics,
  DbsderId
} from './common.zod'
export { parseAffaire, parsePartialAffaire, Affaire, UnIdentifiedAffaire } from './affaires.zod'
export { CategorieCodeDecision, CodeDecision } from './codeDecisions.zod'
export { NiveauCodeNAC, CodeNac, CategoriesToOmit, parsePartialCodeNac } from './codeNacs.zod'
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
export type UnIdentifiedDecision =
  | UnIdentifiedDecisionTj
  | UnIdentifiedDecisionTcom
  | UnIdentifiedDecisionCa
  | UnIdentifiedDecisionCc
  | UnIdentifiedDecisionDila
  | UnIdentifiedDecisionCph

export function parseId(x: unknown): DbsderId {
  return zObjectId.parse(x)
}

export function parseSourceName(x: unknown): Decision['sourceName'] {
  const sourceName = decisionCaSchema
    .pick({ sourceName: true })
    .or(decisionCcSchema.pick({ sourceName: true }))
    .or(decisionTjSchema.pick({ sourceName: true }))
    .or(decisionTcomSchema.pick({ sourceName: true }))
    .or(decisionDilaSchema.pick({ sourceName: true }))
    .or(decisionCphSchema.pick({ sourceName: true }))
    .parse({ sourceName: x }).sourceName

  // /!\ used to check exhaustivity: error type means you forget a schema /!\
  type ExhaustiveSourceName = Decision['sourceName'] extends typeof sourceName
    ? typeof sourceName
    : never
  const exhaustiveSourceName: ExhaustiveSourceName = sourceName

  return exhaustiveSourceName
}

export function parseUnIdentifiedDecision(x: unknown): UnIdentifiedDecision {
  const isValidX = typeof x === 'object' && x != null && 'sourceName' in x
  if (!isValidX) throw new Error('There is no sourceName in decision')

  const sourceName = parseSourceName(x.sourceName)

  switch (sourceName) {
    case 'jurinet':
      return parseDecisionCc(x)
    case 'jurica':
      return parseDecisionCa(x)
    case 'juritj':
      return parseDecisionTj(x)
    case 'dila':
      return parseDecisionDila(x)
    case 'juritcom':
      return parseDecisionTcom(x)
    case 'portalis-cph':
      return parseDecisionCph(x)
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
  | Partial<DecisionCph> {
  switch (sourceName) {
    case 'jurinet':
      return parsePartialDecisionCc(x)
    case 'jurica':
      return parsePartialDecisionCa(x)
    case 'juritj':
      return parsePartialDecisionTj(x)
    case 'dila':
      return parsePartialDecisionDila(x)
    case 'juritcom':
      return parsePartialDecisionTcom(x)
    case 'portalis-cph':
      return parsePartialDecisionCph(x)
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
