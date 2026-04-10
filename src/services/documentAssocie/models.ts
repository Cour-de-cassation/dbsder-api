import {
  DocumentAssocie as DocumentAssociePayload,
  ParseError,
  UnIdentifiedDocumentAssocie as UnIdentifiedDocumentAssociePayload,
  parseDocumentAssocie,
  parsePartialDocumentAssocie
} from '@dbsder-api-types'
import { isCustomError, NotSupported, toNotSupported } from '../error'
import { ObjectId } from 'mongodb'
import { IdParse, parseModelWithId, serializeModelWithId } from '../../utils/serializeId'

export type DocumentAssocie = IdParse<DocumentAssociePayload, '_id' | 'decisionId'>
export type UnIdentifiedDocumentAssocie = IdParse<UnIdentifiedDocumentAssociePayload, 'decisionId'>

export type DocumentAssocieSearchQuery = { decisionId: ObjectId }
export function parseDocumentAssocieSearchQuery(x: unknown): DocumentAssocieSearchQuery {
  if (typeof x !== 'object' || !x) throw new NotSupported('documentAssocieSearchQuery', x)

  const decisionId = 'decisionId' in x ? x.decisionId : undefined

  if (decisionId) return parseModelWithId({ decisionId }, 'decisionId')

  throw new NotSupported(
    'documentAssocieSearchQuery',
    x,
    'documentAssocieSearchQuery is empty or valids search fields are missing'
  )
}

const protectedKeys = ['_id', 'decisionId', 'documentType', 'originalText', 'metadata'] as const

export function parseUpdatableDocumentAssocieFields(
  x: unknown
): Partial<
  Omit<DocumentAssocie, '_id' | 'decisionId' | 'documentType' | 'originalText' | 'metadata'>
> {
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
    return parseModelWithId(parseDocumentAssocie(x), 'decisionId')
  } catch (err) {
    if (isCustomError(err)) throw err
    if (err instanceof ParseError) throw toNotSupported('documentAssocieCreateQuery', x, err)
    throw new NotSupported('documentAssocieCreateQuery', x)
  }
}

export function serializeDocumentAssocie(documentAssocie: DocumentAssocie): DocumentAssociePayload {
  return serializeModelWithId(documentAssocie, '_id', 'decisionId')
}
