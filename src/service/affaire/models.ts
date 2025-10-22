import { Affaire, isPartialValidAffaire, ParseError, parseId as parseDbsderId } from 'dbsder-api-types'
import { isCustomError, NotSupported, toNotSupported } from '../../library/error'
import { Filter, ObjectId } from 'mongodb'

export type AffaireSearchQuery = { decisionId?: ObjectId, numeroPourvoi?: string }

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

  const numeroPourvoi = "numeroPourvoi" in x ? x.numeroPourvoi : undefined
  const decisionId = "decisionId" in x ? parseId(x.decisionId) : undefined

  if (numeroPourvoi !== undefined && typeof numeroPourvoi !== 'string')
    throw new NotSupported('query.numeroPourvoi', numeroPourvoi, "numeroPourvoi should be a string")

  if (numeroPourvoi && decisionId) return { numeroPourvoi, decisionId }
  if (numeroPourvoi) return { numeroPourvoi }
  if (decisionId) return { decisionId }

  throw new NotSupported("affaireSearchQuery", x, "affaireSearchQuery is empty or valids search fields are missing")
}

export function parseAffaireUpdateQuery(x: unknown): Partial<Affaire> {
  try {
    const partialAffaire = isPartialValidAffaire(x)
    if (Object.keys(partialAffaire).length === 0) 
      throw new NotSupported("affaireUpdateQuery", x, "affaireUpdateQuery is empty or valids search fields are missing")
    return partialAffaire
  } catch(err) {
    if(isCustomError(err)) throw err
    if(err instanceof ParseError) throw toNotSupported("affaireUpdateQuery", x, err)
    throw new NotSupported("affaireUpdateQuery", x)
  }
}

export function mapQueryIntoFilter(searchItems: AffaireSearchQuery): Filter<Affaire> {
  return {
    ...( searchItems.decisionId ? { decisionIds: searchItems.decisionId } : {} ),
    ...( searchItems.numeroPourvoi ? { numeroPourvois: searchItems.numeroPourvoi } : {} )
  }
}

export function mapQueryIntoAffaire(searchItems: AffaireSearchQuery): Omit<Affaire, "_id"> {
  return {
    decisionIds: searchItems.decisionId ? [searchItems.decisionId] : [],
    numeroPourvois: searchItems.numeroPourvoi ? [searchItems.numeroPourvoi] : [],
    replacementTerms: []
  }
}
