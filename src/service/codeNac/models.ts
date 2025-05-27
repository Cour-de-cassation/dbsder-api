import { parseId as parseDbsderId } from 'dbsder-api-types'
import { notSupported } from '../../library/error'
import { ObjectId } from 'mongodb'

export function parseId(maybeId: unknown): ObjectId {
  try {
    return parseDbsderId(maybeId)
  } catch (err) {
    throw err instanceof Error
      ? notSupported('id', maybeId, err)
      : notSupported('id', maybeId, new Error('Given ID is not a valid ID'))
  }
}
