import { z } from 'zod'

import {
  zBlocOccultation,
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

export const decisionCphSchema = z.object({
  _id: zObjectId,
  sourceId: z.string(),
  sourceName: z.literal('portalis-cph'),
  originalText: z.string(),
  pseudoText: z.string().optional(),
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
  NACCode: z.string(),
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
  blocOccultation: zBlocOccultation.optional(),
  occultation: zOccultation,
  recommandationOccultation: zSuiviOccultation,
  formation: z.union([z.string(), z.undefined()]).optional(),
  parties: z.array(z.unknown()),
  composition: z.array(z.unknown()),
  tiers: z.array(z.unknown()),
  public: z.boolean(),
  debatPublic: z.boolean(),
  indicateurQPC: z.boolean().optional(),
  // matiereDeterminee: z.undefined().optional(),
  pourvoiCourDeCassation: z.boolean(),
  pourvoiLocal: z.boolean(),
  filenameSource: z.string(),
  raisonInteretParticulier: zRaisonInteretParticulier.nullable().optional()
})
export type DecisionCph = z.infer<typeof decisionCphSchema>
export type UnIdentifiedDecisionCph = Omit<DecisionCph, '_id'>

export function hasSourceNameCph(x: UnIdentifiedDecision): x is UnIdentifiedDecisionCph
export function hasSourceNameCph(x: Decision): x is DecisionCph
export function hasSourceNameCph(
  x: Decision | UnIdentifiedDecision
): x is DecisionCph | UnIdentifiedDecisionCph {
  return x.sourceName === 'portalis-cph'
}

export function parseDecisionCph(x: unknown): UnIdentifiedDecisionCph {
  return decisionCphSchema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionCph(x: unknown): Partial<DecisionCph> {
  return decisionCphSchema.partial().parse(x)
}
