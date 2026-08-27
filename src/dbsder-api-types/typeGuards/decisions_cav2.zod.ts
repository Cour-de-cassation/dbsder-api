import { z } from 'zod'

import {
  zBlocOccultation,
  zEvents,
  zLabelStatus,
  zLabelTreatments,
  zObjectId,
  zOccultation,
  zPublishStatus,
  zRaisonInteretParticulier,
  zSuiviOccultation,
  zZoning
} from './common.zod'
import { Decision, UnIdentifiedDecision } from './index'

const zDecisionAttaquee = z.object({
  type_juridiction: z.string().nullable(),
  ville: z.string().nullable(),
  date: z.string().nullable()
})
export type DecisionAttaqueeCaV2 = z.infer<typeof zDecisionAttaquee>

const zParty = z.object({
  identite: z.string().optional(),
  qualite_partie: z.string().optional(),
  type_personne: z.string().optional()
})
export type PartyCaV2 = z.infer<typeof zParty>

export const decisionCaV2Schema = z.object({
  _id: zObjectId,
  sourceId: zObjectId,
  rawFileId: z.string().optional(),
  events: zEvents.optional(),
  sourceName: z.literal('juricav2'),
  oracle_id: z.number().optional().nullable(),
  originalText: z.string(),
  pseudoText: z.string().optional(),
  zoning: zZoning.optional(),
  originalTextZoning: zZoning.optional(),
  pseudoTextZoning: zZoning.optional(),
  labelStatus: zLabelStatus,
  publishStatus: zPublishStatus.optional(),
  labelTreatments: zLabelTreatments.optional(),
  dateDecision: z.string(),
  dateCreation: z.string(),
  publishDate: z.string().optional().nullable(),
  firstImportDate: z.string().optional().nullable(),
  lastImportDate: z.string().optional(),
  unpublishDate: z.string().optional().nullable(),
  registerNumber: z.string().trim().min(1).max(40),
  NACCode: z.string().optional().nullable(),
  NACLibelle: z.string().optional(),
  endCaseCode: z.string(),
  libelleEndCaseCode: z.string().optional(),
  chamberId: z.string().optional(),
  chamberName: z.string().optional(),
  jurisdictionCode: z.string(),
  jurisdictionId: z.string(),
  jurisdictionName: z.string(),
  selection: z.boolean(),
  sommaire: z.string().optional(),
  blocOccultation: zBlocOccultation.optional().nullable(),
  occultation: zOccultation,
  recommandationOccultation: zSuiviOccultation,
  parties: z.union([z.array(zParty), z.object({})]).optional(),
  composition: z.string().max(200).nullable().optional(),
  public: z.boolean(),
  debatPublic: z.boolean(),
  indicateurQPC: z.boolean().optional(),
  matiereDeterminee: z.boolean().optional(),
  pourvoiLocal: z.boolean().optional(),
  pourvoiCourDeCassation: z.boolean().optional(),
  raisonInteretParticulier: zRaisonInteretParticulier.nullable().optional(),
  solution: z.string().optional(),
  decatt: zDecisionAttaquee.nullable().optional(),
  filenameSource: z.string().optional()
})
export type DecisionCaV2 = z.infer<typeof decisionCaV2Schema>
export type UnIdentifiedDecisionCaV2 = Omit<DecisionCaV2, '_id'>

export function hasSourceNameCaV2(x: UnIdentifiedDecision): x is UnIdentifiedDecisionCaV2
export function hasSourceNameCaV2(x: Decision): x is DecisionCaV2
export function hasSourceNameCaV2(
  x: Decision | UnIdentifiedDecision
): x is DecisionCaV2 | UnIdentifiedDecisionCaV2 {
  return x.sourceName === 'juricav2'
}

export function parseDecisionCaV2(x: unknown): UnIdentifiedDecisionCaV2 {
  return decisionCaV2Schema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionCaV2(x: unknown): Partial<DecisionCaV2> {
  return decisionCaV2Schema.partial().parse(x)
}
