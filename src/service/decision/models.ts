import {
  UnIdentifiedDecisionDila,
  UnIdentifiedDecision,
  parseUnIdentifiedDecision,
  parseId as parseDbsderId,
  parseSourceName,
  Decision,
  parseLabelStatus,
  DecisionDila,
  hasSourceNameDila,
  DecisionTcom,
  parsePartialDecision,
  DecisionTj,
  DecisionCc,
  DecisionCa,
  ParseError
} from 'dbsder-api-types'
import { ObjectId } from 'mongodb'
import { ZoningParameters } from '../../library/zoning'
import { NotSupported, toNotSupported, UnexpectedError } from '../../library/error'

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
      throw new NotSupported('decision.sourceName', decision.sourceName)
    if (!hasOriginalText(decision))
      throw new NotSupported(
        'decision.originalText',
        decision.originalText,
        'originalText in decision is missing'
      )
    return decision
  } catch (err) {
    if (err instanceof ParseError) throw toNotSupported('decision', x, err)
    else throw err
  }
}

export function parseId(maybeId: unknown): ObjectId {
  try {
    return parseDbsderId(maybeId)
  } catch (err) {
    throw err instanceof Error
      ? toNotSupported('id', maybeId, err)
      : new NotSupported('id', maybeId, 'Given ID is not a valid ID')
  }
}

function parseDate(x: unknown): Date {
  if (typeof x !== 'string' || !/\d{4}-\d{2}-\d{2}/.test(x))
    throw new NotSupported('date', x, 'Date should be at format: yyyy-mm-dd')
  const date = new Date()
  date.setFullYear(parseInt(x.slice(0, 'yyyy'.length)))
  date.setMonth(parseInt(x.slice('yyyy-'.length, 'yyyy-mm'.length)) - 1)
  date.setDate(parseInt(x.slice('yyyy-mm-'.length, 'yyyy-mm-dd'.length)))
  if (Number.isNaN(date.valueOf())) throw new UnexpectedError()
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
  if (typeof x !== 'object' || !x) throw new NotSupported('filters', x)
  const dateType = 'dateType' in x && x.dateType === 'dateCreation' ? x.dateType : 'dateDecision'

  let filter: DecisionListFilters = { dateType }

  if ('sourceName' in x) {
    try {
      filter = { ...filter, sourceName: parseSourceName(x.sourceName) }
    } catch (err) {
      throw err instanceof Error
        ? toNotSupported('sourceName', x.sourceName, err)
        : new NotSupported('sourceName', x.sourceName)
    }
  }

  if ('labelStatus' in x) {
    try {
      filter = { ...filter, labelStatus: parseLabelStatus(x.labelStatus) }
    } catch (err) {
      throw err instanceof Error
        ? toNotSupported('labelStatus', x.labelStatus, err)
        : new NotSupported('labelStatus', x.labelStatus)
    }
  }

  if ('sourceId' in x) {
    const sourceId = x.sourceId
    if (typeof sourceId !== 'string') throw new NotSupported('sourceId', sourceId)

    if (filter.sourceName === 'dila') filter = { ...filter, sourceId }
    else {
      const sourceIdAsNumber = parseInt(sourceId)
      if (isNaN(sourceIdAsNumber)) throw new NotSupported('sourceId', sourceId)
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

const protectedKeys = ['_id', 'sourceId', 'sourceName'] as const
export type UpdatableDecisionFields =
  | Partial<DecisionTcom>
  | Partial<DecisionTj>
  | Partial<DecisionCc>
  | Partial<DecisionCa>
export function parseUpdatableDecisionFields(
  sourceName: Decision['sourceName'],
  x: unknown
): UpdatableDecisionFields {
  try {
    if (typeof x !== 'object' || !x) throw new NotSupported('decisionFields', x)

    if (sourceName === 'dila')
      throw new NotSupported('updatableDecisionFields', x, "Dbsder-api doesn't handle Dila source")

    const updatableDecisionFields = parsePartialDecision(sourceName, x) as Exclude<
      ReturnType<typeof parsePartialDecision>,
      Partial<DecisionDila>
    >
    if (protectedKeys.some((key) => Object.keys(updatableDecisionFields).includes(key)))
      throw new NotSupported(
        'updatableDecisionFields',
        updatableDecisionFields,
        `Keys: "${protectedKeys.join(', ')}" are protected and cannot be update`
      )

    return updatableDecisionFields
  } catch (err) {
    if (err instanceof ParseError) throw toNotSupported('decision', x, err)
    else throw err
  }
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
