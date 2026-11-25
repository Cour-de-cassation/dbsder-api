import { z } from 'zod'
import { JurisdictionType, zObjectId } from './common.zod'

export const codeJurisdictionSchema = z.object({
  _id: zObjectId,
  jurisdictionType: z.enum(JurisdictionType).exclude([JurisdictionType.AUTRE, JurisdictionType.CC]),
  code: z.string(),
  libelle: z.string(),
  commentaire: z.string().nullable().optional(),
  dateDebutValidite: z.date(),
  dateFinValidite: z.date().nullable().optional(),
  location: z.string()
})
export type CodeJurisdiction = z.infer<typeof codeJurisdictionSchema>
