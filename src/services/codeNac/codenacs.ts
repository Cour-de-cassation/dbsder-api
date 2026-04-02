import { Filter } from 'mongodb'
import { CodeNac as CodeNacPayload, DebatsPublics, DecisionsPubliques } from 'dbsder-api-types'
import { IdParse } from '../../utils/serializeId'

export type CodeNac = IdParse<CodeNacPayload, '_id'>

export const codeNacFiltersMongo = {
  unconditionalNonPublic: {
    decisionsPubliques: {
      $in: [DecisionsPubliques.DECISIONS_NON_PUBLIQUES, DecisionsPubliques.DECISIONS_MIXTES]
    },
    debatsPublics: { $in: [DebatsPublics.DEBATS_NON_PUBLICS, DebatsPublics.DEBATS_MIXTES] }
  },
  conditionalNonPublic: {
    decisionsPubliques: {
      $in: [DecisionsPubliques.DECISIONS_NON_PUBLIQUES, DecisionsPubliques.DECISIONS_MIXTES]
    },
    debatsPublics: DebatsPublics.DEBATS_PUBLICS
  },
  partiallyPublic: {
    decisionsPubliques: DecisionsPubliques.DECISIONS_PUBLIQUES,
    debatsPublics: { $in: [DebatsPublics.DEBATS_NON_PUBLICS, DebatsPublics.DEBATS_MIXTES] }
  }
} as const

export type FilterNacKey = keyof typeof codeNacFiltersMongo

function isFilterNacKey(value: unknown): value is FilterNacKey {
  return typeof value === 'string' && value in codeNacFiltersMongo
}

export function parseFilterNAC(query: unknown): Filter<Omit<CodeNac, 'id'>> {
  const now = new Date()
  const defaultFilters: Filter<Omit<CodeNac, 'id'>> = {
    dateDebutValidite: { $lte: now },
    $or: [{ dateFinValidite: null }, { dateFinValidite: { $gte: now } }]
  }

  if (query && isFilterNacKey(query)) {
    return {
      $and: [defaultFilters, codeNacFiltersMongo[query]]
    }
  }

  return defaultFilters
}
