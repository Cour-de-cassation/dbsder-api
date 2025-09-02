import { ParseError, stringifyError } from 'dbsder-api-types'

export class NotSupported extends Error {
  type = 'notSupported' as const
  variableName: string
  variableValue: unknown
  explain: unknown
  constructor(variableName: string, variableValue: unknown, message?: string, explain?: unknown) {
    const _message = message
      ? message
      : `value: ${variableValue} is not supported to ${variableName}.`
    super(_message)
    this.variableName = variableName
    this.variableValue = variableValue
    this.explain = explain
  }
}

export function toNotSupported(variableName: string, variableValue: unknown, error: Error) {
  if (error instanceof ParseError) {
    return new NotSupported(
      variableName,
      variableValue,
      `parse error on ${variableName}`,
      stringifyError(error)
    )
  }
  return Object.assign(new NotSupported(variableName, variableValue, error.message), error)
}

export class MissingValue extends Error {
  type = 'missingValue' as const
  variableName: string
  constructor(variableName: string, message?: string) {
    const _message = message ? message : `${variableName} is required but missing.`
    super(_message)
    this.variableName = variableName
  }
}
export function isMissingValue(x: unknown) {
  return !!x && x instanceof Error && 'type' in x && x.type === 'missingValue'
}
export class NotFound extends Error {
  type = 'notFound' as const
  variableName: string
  constructor(variableName: string, message?: string) {
    const _message = message ? message : `${variableName} not found.`
    super(_message)
    this.variableName = variableName
  }
}

export class UnauthorizedError extends Error {
  type = 'unauthorizedError' as const
  constructor(message?: string) {
    const _message = message
      ? message
      : `Resource needs to be logged to access. Currently unauthorized.`
    super(_message)
  }
}

export class ForbiddenError extends Error {
  type = 'forbiddenError' as const
  constructor(message?: string) {
    const _message = message
      ? message
      : `Your connexion cannot access to this resource. Currently forbidden.`
    super(_message)
  }
}

export class UnexpectedError extends Error {
  type = 'unexpectedError' as const
  constructor(message?: string) {
    const _message = message ? message : `Unexepected error occurs.`
    super(_message)
  }
}
export function toUnexpectedError(error: Error) {
  return Object.assign(new UnexpectedError(), error)
}

type CustomError =
  | NotSupported
  | MissingValue
  | NotFound
  | UnauthorizedError
  | ForbiddenError
  | UnexpectedError

export function isCustomError(x: unknown): x is CustomError {
  const isValidX = !!x && x instanceof Error && 'type' in x
  if (!isValidX) return false

  switch (x.type) {
    case 'notFound':
    case 'notSupported':
    case 'missingValue':
    case 'forbiddenError':
    case 'unauthorizedError':
    case 'unexpectedError':
      return true
    default:
      return false
  }
}
