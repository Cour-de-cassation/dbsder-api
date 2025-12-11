import {
  DocumentAssocie,
  ParseError,
  UnIdentifiedDocumentAssocie,
  parseId as parseDbsderId,
  parseDocumentAssocie,
  parsePartialDocumentAssocie
} from 'dbsder-api-types'
import { isCustomError, NotSupported, toNotSupported } from '../../library/error'
import { ObjectId } from 'mongodb'

export function parseId(maybeId: unknown): ObjectId {
  try {
    return parseDbsderId(maybeId)
  } catch (err) {
    throw err instanceof Error
      ? toNotSupported('id', maybeId, err)
      : new NotSupported('id', maybeId, 'Given ID is not a valid ID')
  }
}

export type DocumentAssocieSearchQuery = { decisionId: ObjectId }
export function parseDocumentAssocieSearchQuery(x: unknown): DocumentAssocieSearchQuery {
  if (typeof x !== 'object' || !x) throw new NotSupported('documentAssocieSearchQuery', x)

  const decisionId = 'decisionId' in x ? parseId(x.decisionId) : undefined

  if (decisionId) return { decisionId }

  throw new NotSupported(
    'documentAssocieSearchQuery',
    x,
    'documentAssocieSearchQuery is empty or valids search fields are missing'
  )
}

const protectedKeys = ['_id', 'decisionId', 'documentType', 'originalText', 'metadata'] as const

export function parseUpdatableDocumentAssocieFields(x: unknown): Partial<DocumentAssocie> {
  try {
    if (typeof x !== 'object' || !x) throw new NotSupported('documentAssocieFields', x)

    const updatableDocumentAssocieFields = parsePartialDocumentAssocie(x)
    if (Object.keys(updatableDocumentAssocieFields).length === 0)
      throw new NotSupported(
        'documentAssocieUpdateQuery',
        x,
        'documentAssocieUpdateQuery is empty or valids search fields are missing'
      )

    if (protectedKeys.some((key) => Object.keys(updatableDocumentAssocieFields).includes(key)))
      throw new NotSupported(
        'updatableDocumentAssocieFields',
        updatableDocumentAssocieFields,
        `Keys: "${protectedKeys.join(', ')}" are protected and cannot be update`
      )

    return updatableDocumentAssocieFields
  } catch (err) {
    if (err instanceof ParseError) throw toNotSupported('documentAssocie', x, err)
    else throw err
  }
}

export function parseDocumentAssocieCreateQuery(x: unknown): UnIdentifiedDocumentAssocie {
  try {
    return parseDocumentAssocie(x)
  } catch (err) {
    if (isCustomError(err)) throw err
    if (err instanceof ParseError) throw toNotSupported('documentAssocieCreateQuery', x, err)
    throw new NotSupported('documentAssocieCreateQuery', x)
  }
}
