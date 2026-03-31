import {
  Affaire as AffairePayload,
  parseAffaire,
  ParseError,
  parsePartialAffaire,
  UnIdentifiedAffaire as UnIdentifiedAffairePayload
} from 'dbsder-api-types'
import { isCustomError, NotSupported, toNotSupported } from '../error'
import { Filter, ObjectId } from 'mongodb'
import { IdParse, parseModelWithId, serializeModelWithId } from '../../utils/serializeId'

export type AffaireSearchQuery = { decisionId?: ObjectId }
export type Affaire = IdParse<AffairePayload, '_id' | 'decisionIds' | 'documentAssocieIds'>
export type UnIdentifiedAffaire = IdParse<UnIdentifiedAffairePayload, 'decisionIds' | 'documentAssocieIds'>

export function parseAffaireSearchQuery(x: unknown): AffaireSearchQuery {
  try {
    if (typeof x !== 'object' || !x) throw new NotSupported('affaireSearchQuery', x)

    const decisionId = 'decisionId' in x ? x.decisionId : undefined
    return parseModelWithId({ decisionId }, "decisionId")
  } catch (err) {
    throw new NotSupported(
      'affaireSearchQuery',
      x,
      'affaireSearchQuery is empty or valids search fields are missing'
    )
  }
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
    return parseModelWithId(partialAffaire, "_id", "decisionIds", "documentAssocieIds")
  } catch (err) {
    if (isCustomError(err)) throw err
    if (err instanceof ParseError) throw toNotSupported('affaireUpdateQuery', x, err)
    throw new NotSupported('affaireUpdateQuery', x)
  }
}

export function parseAffaireCreateQuery(x: unknown): UnIdentifiedAffaire {
  try {
    return parseModelWithId(parseAffaire(x), "decisionIds", "documentAssocieIds")
  } catch (err) {
    if (isCustomError(err)) throw err
    if (err instanceof ParseError) throw toNotSupported('affaireCreateQuery', x, err)
    throw new NotSupported('affaireCreateQuery', x)
  }
}

export function mapQueryIntoFilter(searchItems: AffaireSearchQuery): Filter<Affaire> {
  return {
    ...(searchItems.decisionId ? { decisionIds: searchItems.decisionId } : {})
  }
}

export function serializeAffaire(affaire: Affaire): AffairePayload {
  return serializeModelWithId(affaire, '_id', 'decisionIds', 'documentAssocieIds')
}
