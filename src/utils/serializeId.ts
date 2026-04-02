import { ObjectId } from 'mongodb'

type ParseField<T> = T extends string ? ObjectId : T extends string[] ? ObjectId[] : never
type SerializeField<T> = T extends ObjectId ? string : T extends ObjectId[] ? string[] : never

export type IdParse<T, K extends keyof T> = Omit<T, K> & { [k in K]: ParseField<T[k]> }
export type Idserialize<T, K extends keyof T> = Omit<T, K> & { [k in K]: SerializeField<T[k]> }

function parseId(field: string): ObjectId
function parseId(field: string[]): ObjectId[]
function parseId(field: string | string[]): ParseField<typeof field> {
  if (Array.isArray(field)) return field.map((_) => parseId(_))

  if (!ObjectId.isValid(field)) throw new Error(`parseId: not parsable to ObjectId`)
  return new ObjectId(field)
}

function serializeId(field: ObjectId): string
function serializeId(field: ObjectId[]): string[]
function serializeId(field: ObjectId | ObjectId[]): SerializeField<typeof field> {
  if (Array.isArray(field)) return field.map((_) => serializeId(_))

  return field.toString()
}

export function parseModelWithId<T, K extends keyof T>(model: T, ...keys: K[]): IdParse<T, K> {
  try {
    return keys.reduce((acc, key) => {
      if (typeof acc[key] === 'string')
        return {
          ...acc,
          [key]: parseId(acc[key])
        }
      if (Array.isArray(acc[key]) && acc[key].every((_) => typeof _ === 'string'))
        return {
          ...acc,
          [key]: parseId(acc[key])
        }
      if (acc[key] === undefined) return acc
      throw new Error(`parseId: not parsable to ObjectId`)
    }, model as Partial<T>) as IdParse<T, K> // because intermediate type during reduce.
  } catch {
    throw new Error(`parseId: not parsable to ObjectId`)
  }
}

export function serializeModelWithId<T, K extends keyof T>(
  model: T,
  ...keys: K[]
): Idserialize<T, K> {
  try {
    return keys.reduce((acc, key) => {
      if (acc[key] instanceof ObjectId)
        return {
          ...acc,
          [key]: serializeId(acc[key])
        }
      if (Array.isArray(acc[key]) && acc[key].every((_) => _ instanceof ObjectId))
        return {
          ...acc,
          [key]: serializeId(acc[key])
        }
      if (acc[key] === undefined) return acc
      throw new Error(`serializeId: not serializable from ObjectId`)
    }, model as Partial<T>) as Idserialize<T, K> // because intermediate type during reduce.
  } catch {
    throw new Error(`serializeId: not serializable from ObjectId`)
  }
}
