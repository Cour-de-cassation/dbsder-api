import { Filter, ObjectId } from 'mongodb'
import { Affaire, ParseError } from 'dbsder-api-types'
import { toNotSupported } from '../../library/error'

export type affaireSearchType = {
  decisionId?: ObjectId
  numeroPourvoi?: string
}

export function buildAffaireFilter(searchItems: {
  decisionId?: ObjectId
  numeroPourvoi?: string
}): Filter<Affaire> {
  try {
    const mongoFilter: Filter<Affaire> = {}

    const orConditions: Filter<Affaire>[] = []

    if (searchItems.decisionId) {
      orConditions.push({ decisionIds: { $in: [searchItems.decisionId] } })
    }

    if (searchItems.numeroPourvoi) {
      orConditions.push({ numeroPourvois: { $in: [searchItems.numeroPourvoi] } })
    }

    if (orConditions.length) {
      mongoFilter.$or = orConditions
    }

    return mongoFilter
  } catch (error: unknown) {
    if (error instanceof ParseError) throw toNotSupported('affaire', searchItems, error)
    else throw error
  }
}
