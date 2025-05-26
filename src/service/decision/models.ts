import {
  UnIdentifiedDecisionDila,
  UnIdentifiedDecision,
  parseUnIdentifiedDecision,
  isId,
  isSourceName,
  Decision,
  isLabelStatus,
  DecisionDila,
  LabelStatus,
  LabelTreatment,
  isLabelTreatment,
  PublishStatus,
  isPublishStatus,
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
  if (!isId(maybeId)) throw notSupported('id', maybeId, new Error('Given ID is not a valid ID'))
  return new ObjectId(maybeId)
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
    const sourceName = x.sourceName
    if (!isSourceName(sourceName)) throw notSupported('sourceName', sourceName, new Error())
    filter = { ...filter, sourceName }
  }

  if ('labelStatus' in x) {
    const labelStatus = x.labelStatus
    if (!isLabelStatus(labelStatus)) throw notSupported('labelStatus', labelStatus, new Error())
    filter = { ...filter, labelStatus }
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

export type UpdatableDecisionFields = {
  labelStatus?: LabelStatus
  publishStatus?: PublishStatus
  pseudoText?: string
  labelTreatments?: LabelTreatment[]
}
export function parseUpdatableDecisionFields(x: unknown): UpdatableDecisionFields {
  if (typeof x !== 'object' || !x) throw notSupported('filters', x, new Error())
  let updateDecision: UpdatableDecisionFields = {}

  if ('publishStatus' in x) {
    const publishStatus = x.publishStatus
    if (!isPublishStatus(publishStatus))
      throw notSupported('publishStatus', publishStatus, new Error())
    updateDecision = { ...updateDecision, publishStatus }
  }

  if ('labelStatus' in x) {
    const labelStatus = x.labelStatus
    if (!isLabelStatus(labelStatus)) throw notSupported('labelStatus', labelStatus, new Error())
    updateDecision = { ...updateDecision, labelStatus }
  }

  if ('pseudoText' in x) {
    const pseudoText = x.pseudoText
    if (typeof pseudoText !== 'string') throw notSupported('pseudoText', pseudoText, new Error())
    updateDecision = { ...updateDecision, pseudoText }
  }

  if ('labelTreatments' in x) {
    const labelTreatments = x.labelTreatments
    if (!Array.isArray(labelTreatments) || !labelTreatments.every(isLabelTreatment))
      throw notSupported('labelTreatments', labelTreatments, new Error())
    updateDecision = { ...updateDecision, labelTreatments }
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
