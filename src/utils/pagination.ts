import { ObjectId } from 'mongodb'
import { NotSupported } from '../services/error'
import { parseModelWithId } from './serializeId'

function parseLimit(query: object) {
  if (!('limit' in query)) return undefined

  if (typeof query.limit !== 'number' || query.limit < 10 || query.limit > 100) {
    throw new NotSupported(
      'query.limit',
      query.limit,
      'limit should be between 10 and 200 (inclusive)'
    )
  }

  return query.limit
}

export type PaginationFilters = { limit?: number } & (
  | { searchBefore: ObjectId }
  | { searchAfter: ObjectId }
  | object
)
export function parsePaginationFilters(query: object): PaginationFilters {
  const limit = parseLimit(query)

  if ('searchBefore' in query && 'searchAfter' in query)
    throw new NotSupported(
      'querystring',
      query,
      'searchBefore cannot be combinated with SearchAfter'
    )

  if ('searchBefore' in query && typeof query.searchBefore === 'string') {
    const { searchBefore } = parseModelWithId({ searchBefore: query.searchBefore }, 'searchBefore')
    return { limit, searchBefore }
  }

  if ('searchAfter' in query && typeof query.searchAfter === 'string') {
    const { searchAfter } = parseModelWithId({ searchAfter: query.searchAfter }, 'searchAfter')
    return { limit, searchAfter }
  }

  return { limit }
}
