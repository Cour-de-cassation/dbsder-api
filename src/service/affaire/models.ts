import {
  Affaire,
  ParseError,
  parseId as parseDbsderId,
  parsePartialAffaire
} from 'dbsder-api-types'
import { isCustomError, NotSupported, toNotSupported } from '../../library/error'
import { Filter, ObjectId } from 'mongodb'

export type AffaireSearchQuery = { decisionId?: ObjectId }

export function parseId(maybeId: unknown): ObjectId {
  try {
    return parseDbsderId(maybeId)
  } catch (err) {
    throw err instanceof Error
      ? toNotSupported('id', maybeId, err)
      : new NotSupported('id', maybeId, 'Given ID is not a valid ID')
  }
}

export function parseAffaireSearchQuery(x: unknown): AffaireSearchQuery {
  if (typeof x !== 'object' || !x) throw new NotSupported('affaireSearchQuery', x)

  const decisionId = 'decisionId' in x ? parseId(x.decisionId) : undefined

  if (decisionId) return { decisionId }

  throw new NotSupported(
    'affaireSearchQuery',
    x,
    'affaireSearchQuery is empty or valids search fields are missing'
  )
}

export function parseAffaireUpdateQuery(x: unknown): Partial<Affaire> {
  try {
    const partialAffaire = parsePartialAffaire(x)
    if (Object.keys(partialAffaire).length === 0)
      throw new NotSupported(
        'affaireUpdateQuery',
        x,
        'affaireUpdateQuery is empty or valids search fields are missing'
      )
    return partialAffaire
  } catch (err) {
    if (isCustomError(err)) throw err
    if (err instanceof ParseError) throw toNotSupported('affaireUpdateQuery', x, err)
    throw new NotSupported('affaireUpdateQuery', x)
  }
}

export function mapQueryIntoFilter(searchItems: AffaireSearchQuery): Filter<Affaire> {
  return {
    ...(searchItems.decisionId ? { decisionIds: searchItems.decisionId } : {})
  }
}

/*export function mapQueryIntoAffaire(searchItems: AffaireSearchQuery): Omit<Affaire, '_id'> {
  return {
    decisionIds: searchItems.decisionId ? [searchItems.decisionId] : [],
    replacementTerms: []
  }
}*/
