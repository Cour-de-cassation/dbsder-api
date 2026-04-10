import { z } from 'zod'
import { Category, zObjectId } from './common.zod'

export const zCategory = z.enum(Category)

export const zReplacementTerms = z.object({
  entityId: z.string(),
  replacementTerm: z.string(),
  originalTextInstances: z.array(z.string()),
  category: zCategory
})

export const zAffaireSchema = z.object({
  _id: zObjectId,
  replacementTerms: z.array(zReplacementTerms),
  decisionIds: z.array(zObjectId).nonempty(),
  documentAssocieIds: z.array(zObjectId)
})
export type Affaire = z.infer<typeof zAffaireSchema>
export type UnIdentifiedAffaire = Omit<Affaire, '_id'>

export function parseAffaire(x: unknown): UnIdentifiedAffaire {
  return zAffaireSchema.omit({ _id: true }).parse(x)
}

export function parsePartialAffaire(x: unknown): Partial<Affaire> {
  return zAffaireSchema.partial().parse(x)
}
