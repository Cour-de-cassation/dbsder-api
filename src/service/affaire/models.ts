import { Filter, ObjectId } from 'mongodb'
import { Affaire, ParseError } from 'dbsder-api-types'
import { toNotSupported } from '../../library/error'

export type affaireSearchType = {
  decisionId?: string
  numeroPourvoi?: string
}

export function buildAffaireFilter(filters: affaireSearchType): {
  mongoFilter: Filter<Affaire>
  filters: affaireSearchType
} {
  try {
    const mongoFilter: Filter<Affaire> = {}

    const orConditions: Filter<Affaire>[] = []

    if (filters.decisionId) {
      orConditions.push({ decisionIds: { $in: [new ObjectId(filters.decisionId)] } })
    }

    if (filters.numeroPourvoi) {
      orConditions.push({ numeroPourvois: { $in: [filters.numeroPourvoi] } })
    }

    if (orConditions.length) {
      mongoFilter.$or = orConditions
    }

    return { mongoFilter, filters }
  } catch (error: unknown) {
    if (error instanceof ParseError) throw toNotSupported('affaire', filters, error)
    else throw error
  }
}
