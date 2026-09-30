import { z } from 'zod'

import {
  Origin,
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

export const decisionCphSchema = z.object({
  _id: zObjectId,
  sourceId: z.string(),
  sourceName: z.literal(Origin.PORTALIS_CPH),
  events: zEvents.optional(),
  portalisNumber: z.string(),
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
  endCaseCode: z.string().optional(),
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
  public: z.boolean(),
  debatPublic: z.boolean(),
  indicateurQPC: z.boolean().optional(),
  filenameSource: z.string(),
  rawFileId: z.string().optional(),
  raisonInteretParticulier: zRaisonInteretParticulier.nullable()
})
export type DecisionCph = z.infer<typeof decisionCphSchema>
export type UnIdentifiedDecisionCph = Omit<DecisionCph, '_id'>

export function hasSourceNameCph(x: UnIdentifiedDecision): x is UnIdentifiedDecisionCph
export function hasSourceNameCph(x: Decision): x is DecisionCph
export function hasSourceNameCph(
  x: Decision | UnIdentifiedDecision
): x is DecisionCph | UnIdentifiedDecisionCph {
  return x.sourceName === Origin.PORTALIS_CPH
}

export function parseDecisionCph(x: unknown): UnIdentifiedDecisionCph {
  return decisionCphSchema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionCph(x: unknown): Partial<DecisionCph> {
  return decisionCphSchema.partial().parse(x)
}
