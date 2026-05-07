import { z } from 'zod'
import { zObjectId } from './common.zod'

export const categorieCodeDecisionSchema = z.object({
  code: z.string(),
  libelle: z.string()
})
export type CategorieCodeDecision = z.infer<typeof categorieCodeDecisionSchema>

export const codeDecisionSchema = z.object({
  _id: zObjectId,
  codeDecision: z.string(),
  libelleCodeDecision: z.string().optional(),
  categorieCodeDecision: categorieCodeDecisionSchema.optional(),
  isTransmissibleToCC: z.boolean().optional(),
  overwritesNAC: z.boolean().optional(),
  routeCA: z.string().nullable().optional(),
  routeTJ: z.string().nullable().optional()
})
export type CodeDecision = z.infer<typeof codeDecisionSchema>
