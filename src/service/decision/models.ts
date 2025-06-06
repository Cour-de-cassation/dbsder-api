import {
  UnIdentifiedDecisionDila,
  UnIdentifiedDecision,
  parseUnIdentifiedDecision,
  parseId as parseDbsderId,
  parseSourceName,
  Decision,
  parseLabelStatus,
  DecisionDila,
  parseLabelTreatments,
  parsePublishStatus,
  hasSourceNameDila
} from 'dbsder-api-types'
import { ObjectId } from 'mongodb'
import { ZoningParameters } from '../../library/zoning'
import { notSupported, unexpectedError } from '../../library/error'
import { ZodError } from 'zod'

export type DecisionSupported = Exclude<Decision, DecisionDila> & {
  originalText: string // Warn: current model accept empty but new data doesn't
}

export type UnIdentifiedDecisionSupported = Exclude<
  UnIdentifiedDecision,
  UnIdentifiedDecisionDila
> & { originalText: string } /// Warn: current model accept empty but new data doesn't

function hasOriginalText(
  x: UnIdentifiedDecision
): x is UnIdentifiedDecision & { originalText: string } {
  return typeof x.originalText === 'string' && !!x.originalText
}

export function parseUnIdentifiedDecisionSupported(x: unknown): UnIdentifiedDecisionSupported {
  try {
    const decision = parseUnIdentifiedDecision(x)
    if (hasSourceNameDila(decision))
      throw notSupported('decision.sourceName', decision.sourceName, new Error())
    if (!hasOriginalText(decision))
      throw notSupported(
        'decision.originalText',
        decision.originalText,
        new Error('originalText in decision is missing')
      )
    return decision
  } catch (err) {
    if (err instanceof ZodError) throw notSupported('decision', x, err)
    else throw err
  }
}

export function parseId(maybeId: unknown): ObjectId {
  try {
    return parseDbsderId(maybeId)
  } catch (err) {
    throw err instanceof Error
      ? notSupported('id', maybeId, err)
      : notSupported('id', maybeId, new Error('Given ID is not a valid ID'))
  }
}

function parseDate(x: unknown): Date {
  if (typeof x !== 'string' || !/\d{4}-\d{2}-\d{2}/.test(x))
    throw notSupported('date', x, new Error('Date should be at format: yyyy-mm-dd'))
  const date = new Date()
  date.setFullYear(parseInt(x.slice(0, 'yyyy'.length)))
  date.setMonth(parseInt(x.slice('yyyy-'.length, 'yyyy-mm'.length)) - 1)
  date.setDate(parseInt(x.slice('yyyy-mm-'.length, 'yyyy-mm-dd'.length)))
  if (Number.isNaN(date.valueOf())) throw unexpectedError(new Error())
  return date
}

export type DecisionListFilters = {
  sourceName?: Decision['sourceName']
  labelStatus?: Decision['labelStatus']
  sourceId?: Decision['sourceId']
  startDate?: Date
  endDate?: Date
  dateType: 'dateDecision' | 'dateCreation'
}
export function parseDecisionListFilters(x: unknown): DecisionListFilters {
  if (typeof x !== 'object' || !x) throw notSupported('filters', x, new Error())
  const dateType = 'dateType' in x && x.dateType === 'dateCreation' ? x.dateType : 'dateDecision'

  let filter: DecisionListFilters = { dateType }

  if ('sourceName' in x) {
    try {
      filter = { ...filter, sourceName: parseSourceName(x.sourceName) }
    } catch (err) {
      throw err instanceof Error
        ? notSupported('sourceName', x.sourceName, err)
        : notSupported('sourceName', x.sourceName, new Error())
    }
  }

  if ('labelStatus' in x) {
    try {
      filter = { ...filter, labelStatus: parseLabelStatus(x.labelStatus) }
    } catch (err) {
      throw err instanceof Error
        ? notSupported('labelStatus', x.labelStatus, err)
        : notSupported('labelStatus', x.labelStatus, new Error())
    }
  }

  if ('sourceId' in x) {
    const sourceId = x.sourceId
    if (typeof sourceId !== 'string') throw notSupported('sourceId', sourceId, new Error())

    if (filter.sourceName === 'dila') filter = { ...filter, sourceId }
    else {
      const sourceIdAsNumber = parseInt(sourceId)
      if (isNaN(sourceIdAsNumber)) throw notSupported('sourceId', sourceId, new Error())
      filter = { ...filter, sourceId: sourceIdAsNumber }
    }
  }

  if ('startDate' in x) {
    const startDate = parseDate(x.startDate)
    filter = { ...filter, startDate }
  }

  if ('endDate' in x) {
    const endDate = parseDate(x.endDate)
    filter = { ...filter, endDate }
  }

  return filter
}

export type UpdatableDecisionFields = Partial<
  Omit<
    UnIdentifiedDecision,
    | 'originalText'
    | 'public'
    | 'debatPublic'
    | 'occultation'
    | 'NACCode'
    | 'endCaseCode'
    | 'blocOccultation'
  >
>

export function parseUpdatableDecisionFields(x: unknown): UpdatableDecisionFields {
  if (typeof x !== 'object' || !x) throw notSupported('filters', x, new Error())
  let updateDecision: UpdatableDecisionFields = x

  if ('publishStatus' in x) {
    try {
      updateDecision.publishStatus = parsePublishStatus(x.publishStatus)
    } catch (err) {
      throw err instanceof Error
        ? notSupported('publishStatus', x.publishStatus, err)
        : notSupported('publishStatus', x.publishStatus, new Error())
    }
  }

  if ('labelStatus' in x) {
    try {
      updateDecision.labelStatus = parseLabelStatus(x.labelStatus)
    } catch (err) {
      throw err instanceof Error
        ? notSupported('labelStatus', x.labelStatus, err)
        : notSupported('labelStatus', x.labelStatus, new Error())
    }
  }

  if ('pseudoText' in x) {
    if (typeof x.pseudoText !== 'string')
      throw notSupported('pseudoText', x.pseudoText, new Error())
  }

  if ('labelTreatments' in x) {
    try {
      updateDecision.labelTreatments = parseLabelTreatments(x.labelTreatments)
    } catch (err) {
      throw err instanceof Error
        ? notSupported('labelTreatments', x.labelTreatments, err)
        : notSupported('labelTreatments', x.labelTreatments, new Error())
    }
  }

  return updateDecision
}

function mapDecisionIntoZoningSource(
  decision: UnIdentifiedDecisionSupported
): ZoningParameters['source'] {
  switch (decision.sourceName) {
    case 'jurica':
      return 'ca'
    case 'juritj':
      return 'tj'
    case 'jurinet':
      return 'cc'
    case 'juritcom':
      return 'tcom'
  }
}

export function mapDecisionIntoZoningParameters(
  decision: UnIdentifiedDecisionSupported
): ZoningParameters {
  return {
    arret_id: decision.sourceId,
    source: mapDecisionIntoZoningSource(decision),
    text: decision.originalText
  }
}

export function mapDecisionIntoUniqueFilters(
  decision: UnIdentifiedDecisionSupported
): Pick<UnIdentifiedDecision, 'sourceName' | 'sourceId'> {
  // Warn: should "sourceId" define unicity ? What's a sourceId for a TJ or a TCOM ?
  return { sourceName: decision.sourceName, sourceId: decision.sourceId }
}

type DateFilters =
  | { dateDecision?: { $gte: string; $lte: string } }
  | { dateCreation?: { $gte: string; $lte: string } }

export function mapDecisionListFiltersIntoDbFilters(filters: DecisionListFilters): {
  sourceName?: Decision['sourceName']
  labelStatus?: Decision['labelStatus']
  sourceId?: Decision['sourceId']
} & DateFilters {
  const { startDate, endDate, dateType, ...filtersOnEqual } = filters
  const dateFilter =
    startDate && endDate
      ? {
          [dateType]: {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString()
          }
        }
      : startDate
        ? {
            [dateType]: {
              $gte: startDate.toISOString(),
              $lte: new Date().toISOString()
            }
          }
        : endDate
          ? {
              [dateType]: {
                $gte: new Date().toISOString(),
                $lte: endDate.toISOString()
              }
            }
          : {}

  return {
    ...filtersOnEqual,
    ...dateFilter
  }
}
