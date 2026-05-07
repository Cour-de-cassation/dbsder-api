import { z } from 'zod'

import {
  zBlocOccultation,
  zLabelStatus,
  zLabelTreatments,
  zObjectId,
  zOccultation,
  zPseudoStatus,
  zPublishStatus,
  zZoning
} from './common.zod'
import { Decision, UnIdentifiedDecision } from './index'

const jurisdictionCodeCcSchema = z.union([z.literal('AUTRE'), z.literal('CC')])
export type JurisdictionCodeCC = z.infer<typeof jurisdictionCodeCcSchema>

const analyzeCcSchema = z.array(z.unknown())
export type AnalyzeCC = z.infer<typeof analyzeCcSchema>

const titreReferenceCcSchema = z.array(z.unknown())
export type TitreReferenceCC = z.infer<typeof titreReferenceCcSchema>

const decisionAnalysisCcSchema = z.object({
  analyse: z.array(analyzeCcSchema).optional().nullable(),
  doctrine: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  reference: z.array(titreReferenceCcSchema).nullable().optional(),
  source: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  target: z.string().nullable().optional(),
  title: z.array(z.string()).nullable().optional(),
  nature: z.string().optional().nullable()
})
export type DecisionAnalysisCC = z.infer<typeof decisionAnalysisCcSchema>

const publicationCategoryCcSchema = z.union([
  z.literal('D'),
  z.literal('P'),
  z.literal('N'),
  z.literal('B'),
  z.literal('R'),
  z.literal('L'),
  z.literal('C')
])
export type PublicationCategoryCC = z.infer<typeof publicationCategoryCcSchema>

export const decisionCcSchema = z.object({
  _id: zObjectId,
  sourceId: z.number(),
  sourceName: z.literal('jurinet'),
  _rev: z.number().or(z.nan()).optional(),
  __v: z.number().or(z.nan()).optional(),
  _version: z.number().or(z.nan()).optional().nullable(),
  originalText: z.string().optional().nullable(),
  pseudoText: z.string().optional().nullable(),
  dateDecision: z.string().nullable(),
  jurisdictionCode: jurisdictionCodeCcSchema.nullable(),
  jurisdictionId: z.null().optional(),
  jurisdictionName: z.string().nullable(),
  public: z.boolean().optional().nullable(),
  solution: z.string().optional().nullable(),
  formation: z.string().optional().nullable(),
  labelStatus: zLabelStatus,
  publishStatus: zPublishStatus.optional(),
  labelTreatments: zLabelTreatments.optional(),
  dateCreation: z.string(),
  publishDate: z.string().optional().nullable(),
  firstImportDate: z.string().optional().nullable(),
  lastImportDate: z.string().optional(),
  unpublishDate: z.string().optional().nullable(),
  zoning: z
    .union([z.literal('Internal Server Error'), z.record(z.string(), z.unknown())])
    .optional()
    .nullable(),
  originalTextZoning: zZoning.optional(),
  pseudoTextZoning: zZoning.optional(),
  registerNumber: z.string().nullable(),
  chamberId: z.string().nullable(),
  chamberName: z.null().optional(),
  pubCategory: publicationCategoryCcSchema.nullable(),
  pseudoStatus: zPseudoStatus,
  appeals: z.array(z.string()),
  analysis: decisionAnalysisCcSchema,
  decatt: z
    .union([z.array(z.string()), z.array(z.number().or(z.nan()))])
    .optional()
    .nullable(),
  blocOccultation: zBlocOccultation.optional().nullable(),
  natureAffaireCivil: z.string().optional().nullable(),
  natureAffairePenal: z.string().optional().nullable(),
  codeMatiereCivil: z.string().optional().nullable(),
  NAOCode: z.string().optional().nullable(),
  NACCode: z.null().optional(),
  NPCode: z.null().optional(),
  locked: z.boolean(),
  publication: z.array(publicationCategoryCcSchema).optional(),
  occultation: zOccultation,
  endCaseCode: z.null().optional(),
  isLoadedInLabel: z.boolean().optional(),
  parties: z.union([z.array(z.array(z.unknown())), z.object({})]).optional(),
  recommandationOccultation: z.null().optional(),
  selection: z.literal(false).optional()
})
export type DecisionCc = z.infer<typeof decisionCcSchema>

export type UnIdentifiedDecisionCc = Omit<DecisionCc, '_id'>

export function hasSourceNameCc(x: UnIdentifiedDecision): x is UnIdentifiedDecisionCc
export function hasSourceNameCc(x: Decision): x is DecisionCc
export function hasSourceNameCc(
  x: Decision | UnIdentifiedDecision
): x is DecisionCc | UnIdentifiedDecisionCc {
  return x.sourceName === 'jurinet'
}

export function parseDecisionCc(x: unknown): UnIdentifiedDecisionCc {
  return decisionCcSchema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionCc(x: unknown): Partial<DecisionCc> {
  return decisionCcSchema.partial().parse(x)
}
