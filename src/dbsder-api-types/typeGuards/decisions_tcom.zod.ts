import { z } from 'zod'

import {
  zBlocOccultation,
  zLabelStatus,
  zLabelTreatments,
  zObjectId,
  zOccultation,
  zPublishStatus,
  zQualitePartie,
  zTypePartie,
  zZoning
} from './common.zod'
import { Decision, UnIdentifiedDecision } from './index'

export enum JusticeFunctionTcom {
  GRF = 'GRF',
  JUG = 'JUG',
  PDT = 'PDT',
  PRO = 'PRO',
  JUS = 'JUS'
}

export const justiceFunctionTcomSchema = z.enum(JusticeFunctionTcom)

const compositionTcomSchema = z.object({
  fonction: justiceFunctionTcomSchema.nullable().optional(),
  nom: z.string(),
  prenom: z.string().nullable().optional(),
  civilite: z.string().nullable().optional()
})
export type CompositionTcom = z.infer<typeof compositionTcomSchema>

export enum JusticeRoleTcom {
  AVOCAT = 'AVOCAT',
  AVOCAT_GENERAL = 'AVOCAT GENERAL',
  RAPPORTEUR = 'RAPPORTEUR',
  MANDATAIRE = 'MANDATAIRE',
  PARTIE = 'PARTIE',
  AUTRE = 'AUTRE'
}
export const justiceRoleTcomSchema = z.enum(JusticeRoleTcom)

const adresseTcomSchema = z.object({
  numero: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  voie: z.string().nullable().optional(),
  codePostal: z.string().nullable().optional(),
  pays: z.string().nullable().optional(),
  localite: z.string().nullable().optional(),
  complement: z.string().nullable().optional(),
  bureau: z.string().nullable().optional()
})
export type AdresseTcom = z.infer<typeof adresseTcomSchema>

const partieTcomSchema = z.object({
  type: zTypePartie,
  role: justiceRoleTcomSchema,
  nom: z.string(),
  nomUsage: z.string().nullable().optional(),
  prenom: z.string().nullable().optional(),
  prenomAutre: z.string().nullable().optional(),
  alias: z.string().nullable().optional(),
  civilite: z.string().nullable().optional(),
  qualite: zQualitePartie,
  adresse: adresseTcomSchema.nullable().optional()
})
export type PartieTcom = z.infer<typeof partieTcomSchema>

export const decisionTcomSchema = z.object({
  _id: zObjectId,
  sourceId: z.number(),
  sourceName: z.literal('juritcom'),
  __v: z.number().or(z.nan()),
  originalText: z.string(),
  pseudoText: z.string().optional(),
  registerNumber: z.string(),
  dateDecision: z.string(),
  jurisdictionCode: z.string(),
  jurisdictionId: z.string(),
  jurisdictionName: z.string(),
  public: z.boolean().nullable().optional(),
  solution: z.string().nullable().optional(),
  labelStatus: zLabelStatus,
  publishStatus: zPublishStatus.optional(),
  labelTreatments: zLabelTreatments.optional(),
  dateCreation: z.string(),
  publishDate: z.string().optional().nullable(),
  firstImportDate: z.string().optional(),
  lastImportDate: z.string().optional(),
  unpublishDate: z.string().optional().nullable(),
  zoning: z.record(z.string(), z.unknown()).optional().nullable(),
  originalTextZoning: zZoning.optional(),
  pseudoTextZoning: zZoning.optional(),
  chamberId: z.string().nullable().optional(),
  chamberName: z.string().nullable().optional(),
  debatPublic: z.boolean(),
  selection: z.boolean(),
  blocOccultation: zBlocOccultation,
  occultation: zOccultation,
  parties: z.array(partieTcomSchema).nullable().optional(),
  filenameSource: z.string(),
  appeals: z.array(z.never()),
  codeMatiereCivil: z.string().nullable().optional(),
  idGroupement: z.string(),
  idDecisionTCOM: z.string(),
  codeProcedure: z.string().nullable().optional(),
  libelleMatiere: z.string().nullable().optional(),
  composition: z.array(compositionTcomSchema).nullable().optional(),
  motifsSecretAffaires: z.boolean(),
  motifsDebatsChambreConseil: z.boolean()
})
export type DecisionTcom = z.infer<typeof decisionTcomSchema>
export type UnIdentifiedDecisionTcom = Omit<DecisionTcom, '_id'>

export function hasSourceNameTcom(x: UnIdentifiedDecision): x is UnIdentifiedDecisionTcom
export function hasSourceNameTcom(x: Decision): x is DecisionTcom
export function hasSourceNameTcom(
  x: Decision | UnIdentifiedDecision
): x is DecisionTcom | UnIdentifiedDecisionTcom {
  return x.sourceName === 'juritcom'
}

export function parseDecisionTcom(x: unknown): UnIdentifiedDecisionTcom {
  return decisionTcomSchema.omit({ _id: true }).parse(x)
}

export function parsePartialDecisionTcom(x: unknown): Partial<DecisionTcom> {
  return decisionTcomSchema.partial().parse(x)
}
