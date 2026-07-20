import { z } from 'zod'
import {
  Category,
  zBlocOccultation,
  zDebatsPublics,
  zDecisionsPubliques,
  zLabelRoute,
  zObjectId
} from './common.zod'

const zCategory = z.enum(Category)

const NiveauCodeNACSchema = z.object({
  code: z.string(),
  libelle: z.string()
})
export type NiveauCodeNAC = z.infer<typeof NiveauCodeNACSchema>

const ChapitreSchema = z.object({
  code: z.string().length(1),
  libelle: z.string()
})

const sousChapitreSchema = z.object({
  code: z.string().length(2),
  libelle: z.string()
})

export enum CategoriesToOmit {
  SUIVI = 'suivi',
  NON_SUIVI = 'nonSuivi'
}

const categoriesToOmitSchema = z.object({
  suivi: z.array(zCategory).nullable(),
  nonSuivi: z.array(zCategory).nullable()
})

const CodeNacSchema = z.object({
  _id: zObjectId,
  codeNAC: z.string().length(3).nonoptional(),
  libelleNAC: z.string().nonoptional(),
  chapitre: ChapitreSchema.nonoptional(),
  sousChapitre: sousChapitreSchema.nonoptional(),
  dateDebutValidite: z.date().nonoptional(),
  dateFinValidite: z.date().nullable(),
  routeRelecture: zLabelRoute.nullable(),
  blocOccultation: zBlocOccultation.nullable(),
  categoriesToOmit: categoriesToOmitSchema.nullable(),
  decisionsPubliques: zDecisionsPubliques.nullable(),
  debatsPublics: zDebatsPublics.nullable(),
  codeUsageNonConseille: z.boolean().default(false)
})

export function parsePartialCodeNac(x: unknown): Partial<CodeNac> {
  return CodeNacSchema.partial().omit({ dateDebutValidite: true, _id: true }).parse(x)
}

export type CodeNac = z.infer<typeof CodeNacSchema>
