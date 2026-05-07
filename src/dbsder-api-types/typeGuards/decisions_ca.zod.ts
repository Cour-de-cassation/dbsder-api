import { z } from 'zod'

import {
  zBlocOccultation,
  zLabelStatus,
  zLabelTreatments,
  zObjectId,
  zOccultation,
  zPseudoStatus,
  zPublishStatus,
  zQualitePartie,
  zRaisonInteretParticulier,
  zSuiviOccultation,
  zTypePartie,
  zZoning
} from './common.zod'
import { Decision, UnIdentifiedDecision } from './index'

const publicationCategoryCaSchema = z.union([z.literal('W'), z.literal('A')])
export type PublicationCategoryCa = z.infer<typeof publicationCategoryCaSchema>

const partieAttributesCaSchema = z.object({
  qualitePartie: zQualitePartie,
  typePersonne: zTypePartie
})
export type PartieAttributesCa = z.infer<typeof partieAttributesCaSchema>

const partieCaSchema = z.object({
  attributes: partieAttributesCaSchema,
  identite: z.string()
})
export type PartieCa = z.infer<typeof partieCaSchema>

const decisionAnalysisCaSchema = z.object({
  analyse: z.array(z.null()).optional(),
  doctrine: z.null().optional(),
  link: z.null().optional(),
  reference: z.array(z.null()).optional(),
  source: z.null().optional(),
  summary: z.null().optional(),
  target: z.null().optional(),
  title: z.null().optional(),
  nature: z.null().optional()
})
export type DecisionAnalysisCa = z.infer<typeof decisionAnalysisCaSchema>

export const decisionCaSchema = z.object({
  _id: zObjectId,
  sourceId: z.number(),
  sourceName: z.literal('jurica'),
  _rev: z.number().or(z.nan()).optional(),
  _version: z.number().or(z.nan()).optional().nullable(),
  originalText: z.string().optional().nullable(),
  pseudoText: z.string().optional().nullable(),
  registerNumber: z.string(),
  dateDecision: z.string().nullable(),
  public: z.boolean().optional().nullable(),
  labelStatus: zLabelStatus,
  publishStatus: zPublishStatus.optional(),
  labelTreatments: zLabelTreatments.optional(),
  dateCreation: z.string(),
  publishDate: z.string().optional().nullable(),
  firstImportDate: z.string().optional().nullable(),
  lastImportDate: z.string().optional(),
  unpublishDate: z.string().optional().nullable(),
  zoning: z.record(z.string(), z.unknown()).optional().nullable(),
  originalTextZoning: zZoning.optional(),
  pseudoTextZoning: zZoning.optional(),
  NACCode: z.string().optional().nullable(),
  libelleNAC: z.string().optional(),
  NPCode: z.string().optional().nullable(),
  libelleNatureParticuliere: z.string().optional(),
  endCaseCode: z.string().optional().nullable(),
  libelleEndCaseCode: z.string().optional(),
  chamberId: z.string().nullable(),
  chamberName: z.string().nullable(),
  jurisdictionCode: z.string().nullable(),
  jurisdictionId: z.string().nullable(),
  jurisdictionName: z.string().nullable(),
  selection: z.boolean().optional(),
  sommaire: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  blocOccultation: zBlocOccultation.optional().nullable(),
  occultation: zOccultation.optional(),
  recommandationOccultation: zSuiviOccultation.optional(),
  pubCategory: publicationCategoryCaSchema,
  pseudoStatus: zPseudoStatus,
  parties: z.union([z.array(partieCaSchema), z.object({})]),
  natureAffaireCivil: z.null().optional(),
  natureAffairePenal: z.null().optional(),
  codeMatiereCivil: z.null().optional(),
  NAOCode: z.null().optional(),
  decatt: z.null().optional(),
  appeals: z.array(z.never()),
  publication: z.array(z.never()).optional().nullable(),
  locked: z.literal(false),
  analysis: decisionAnalysisCaSchema,
  formation: z.null().optional(),
  raisonInteretParticulier: zRaisonInteretParticulier.nullable().optional()
})
export type DecisionCa = z.infer<typeof decisionCaSchema>
export type UnIdentifiedDecisionCa = Omit<DecisionCa, '_id'>

export function hasSourceNameCa(x: UnIdentifiedDecision): x is UnIdentifiedDecisionCa
export function hasSourceNameCa(x: Decision): x is DecisionCa
export function hasSourceNameCa(
  x: Decision | UnIdentifiedDecision
): x is DecisionCa | UnIdentifiedDecisionCa {
  return x.sourceName === 'jurica'
}

export function parseDecisionCa(x: unknown): UnIdentifiedDecisionCa {
  return decisionCaSchema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionCa(x: unknown): Partial<DecisionCa> {
  return decisionCaSchema.partial().parse(x)
}
