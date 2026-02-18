import { Filter } from 'mongodb'
import { CodeNac } from 'dbsder-api-types'

export const codeNacFiltersMongo = {
  unconditionalNonPublic: {
    decisionsPubliques: { $in: ['décisions non publiques', 'décisions mixtes'] },
    debatsPublics: { $in: ['débats non publics', 'débats mixtes'] }
  },
  conditionalNonPublic: {
    decisionsPubliques: { $in: ['décisions non publiques', 'décisions mixtes'] },
    debatsPublics: 'débats publics'
  },
  partiallyPublic: {
    decisionsPubliques: 'décisions publiques',
    debatsPublics: { $in: ['débats non publics', 'débats mixtes'] }
  }
} as const

export type FilterNacKey = keyof typeof codeNacFiltersMongo

function isFilterNacKey(value: unknown): value is FilterNacKey {
  return typeof value === 'string' && value in codeNacFiltersMongo
}

export function parseFilterNAC(query: unknown): Filter<CodeNac> {
  const now = new Date()
  const defaultFilters: Filter<CodeNac> = {
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
