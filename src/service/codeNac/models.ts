import { isId } from 'dbsder-api-types'
import { notSupported } from '../../library/error'
import { ObjectId } from 'mongodb'

export function parseId(maybeId: unknown): ObjectId {
  if (!isId(maybeId)) throw notSupported('id', maybeId, new Error('Given ID is not a valid ID'))
  return new ObjectId(maybeId)
}
