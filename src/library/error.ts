export type NotSupported = Error & {
  type: 'notSupported'
  variableName: string
  variableValue: unknown
}
export function notSupported(
  variableName: string,
  variableValue: unknown,
  error: Error
): NotSupported {
  if (!error.message) error.message = `value: ${variableValue} is not supported to ${variableName}.`
  return Object.assign(error, {
    variableName,
    variableValue,
    type: 'notSupported' as const
  })
}

export type MissingValue = Error & {
  type: 'missingValue'
  variableName: string
}
export function missingValue(variableName: string, error: Error): MissingValue {
  if (!error.message) error.message = `${variableName} is required but missing.`
  return Object.assign(error, {
    variableName,
    type: 'missingValue' as const
  })
}

export type NotFound = Error & {
  type: 'notFound'
  variableName: string
}
export function notFound(variableName: string, error: Error): NotFound {
  if (!error.message) error.message = `${variableName} not found.`
  return Object.assign(error, {
    variableName,
    type: 'notFound' as const
  })
}

export type UnauthorizedError = Error & {
  type: 'unauthorizedError'
}
export function unauthorizedError(error: Error): UnauthorizedError {
  if (!error.message)
    error.message = 'You need to be logged to access at this resource. Currently unauthorized.'
  return Object.assign(error, {
    type: 'unauthorizedError' as const
  })
}

export type ForbiddenError = Error & {
  type: 'forbiddenError'
}
export function forbiddenError(error: Error): ForbiddenError {
  if (!error.message) error.message = 'Your connexion cannot access to this resource. Currently forbidden.'
  return Object.assign(error, {
    type: 'forbiddenError' as const
  })
}

export type UnexpectedError = Error & {
  type: 'unexpectedError'
}
export function unexpectedError(error: Error): UnexpectedError {
  if (!error.message) error.message = 'Unexepected error occurs.'
  return Object.assign(error, {
    type: 'unexpectedError' as const
  })
}
