import { z } from 'zod'

import { zLabelStatus, zObjectId, zPseudoStatus, zPublishStatus } from './common.zod'
import { Decision, UnIdentifiedDecision } from './index'

const jurisdictionCodeDILASchema = z.union([
  z.literal('CA'),
  z.literal('CC'),
  z.literal('OTHER'),
  z.literal('TGI')
])
export type JurisdictionCodeDILA = z.infer<typeof jurisdictionCodeDILASchema>

const publicationCategoryDILASchema = z.union([
  z.literal('D'),
  z.literal('P'),
  z.literal('N'),
  z.literal('B'),
  z.literal('R'),
  z.literal('L'),
  z.literal('C')
])
export type PublicationCategoryDILA = z.infer<typeof publicationCategoryDILASchema>

const decisionAnalysisDILASchema = z.object({
  analyse: z.array(z.never()).optional().nullable(),
  link: z.array(z.string()),
  reference: z.array(z.string()),
  source: z.string(),
  summary: z.array(z.string()),
  title: z.array(z.array(z.string())),
  nature: z.string().optional().nullable(),
  target: z.string().optional().nullable(),
  doctrine: z.null().optional()
})
export type DecisionAnalysisDILA = z.infer<typeof decisionAnalysisDILASchema>

const occultationDILASchema = z.object({
  additionalTerms: z.literal(''),
  categoriesToOmit: z.array(z.never())
})
export type OccultationDILA = z.infer<typeof occultationDILASchema>

export const decisionDilaSchema = z.object({
  _id: zObjectId,
  sourceId: z.string(),
  sourceName: z.literal('dila'),
  _rev: z.number().or(z.nan()),
  _version: z.number().or(z.nan()),
  registerNumber: z.union([z.string(), z.number().or(z.nan())]).nullable(),
  dateDecision: z.union([z.string(), z.date()]),
  dateCreation: z.union([z.string(), z.date()]),
  jurisdictionCode: jurisdictionCodeDILASchema,
  jurisdictionName: z.string(),
  chamberId: z.union([z.string(), z.number().or(z.nan())]).nullable(),
  pubCategory: publicationCategoryDILASchema,
  solution: z.string().nullable(),
  pseudoText: z.string().nullable(),
  pseudoStatus: zPseudoStatus,
  appeals: z.array(z.union([z.string(), z.number().or(z.nan())])),
  analysis: decisionAnalysisDILASchema,
  labelStatus: zLabelStatus,
  occultation: occultationDILASchema.optional(),
  publishStatus: zPublishStatus.optional(),
  unpublishDate: z.string().optional().nullable(),
  public: z.literal(true).optional(),
  locked: z.literal(false),
  NACCode: z.null().optional(),
  NPCode: z.null().optional(),
  endCaseCode: z.null().optional(),
  labelTreatments: z.array(z.never()),
  parties: z.union([z.array(z.never()), z.object({})]),
  decatt: z.null().optional(),
  natureAffaireCivil: z.null().optional(),
  codeMatiereCivil: z.null().optional(),
  natureAffairePenal: z.null().optional(),
  publication: z.array(z.never()).optional(),
  chamberName: z.null().optional(),
  originalText: z.null().optional(),
  zoning: z.null().optional(),
  formation: z.null().optional(),
  blocOccultation: z.null().optional(),
  jurisdictionId: z.null().optional()
})
export type DecisionDila = z.infer<typeof decisionDilaSchema>
export type UnIdentifiedDecisionDila = Omit<DecisionDila, '_id'>

export function hasSourceNameDila(x: UnIdentifiedDecision): x is UnIdentifiedDecisionDila
export function hasSourceNameDila(x: Decision): x is DecisionDila
export function hasSourceNameDila(
  x: Decision | UnIdentifiedDecision
): x is DecisionDila | UnIdentifiedDecisionDila {
  return x.sourceName === 'dila'
}

export function parseDecisionDila(x: unknown): UnIdentifiedDecisionDila {
  return decisionDilaSchema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionDila(x: unknown): Partial<DecisionDila> {
  return decisionDilaSchema.partial().parse(x)
}
