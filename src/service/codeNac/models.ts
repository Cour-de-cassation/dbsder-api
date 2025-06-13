import { parseId as parseDbsderId } from 'dbsder-api-types'
import { NotSupported, toNotSupported } from '../../library/error'
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
