import { LabelStatus } from 'dbsder-api-types'
import {
  Decision,
  DecisionListFilters,
  DecisionSupported,
  idDecisionSupported,
  mapDecisionIntoUniqueFilters,
  mapDecisionListFiltersIntoDbFilters,
  UnIdentifiedDecisionSupported,
  UpdatableDecisionFields
} from './models'
import {
  findDecision,
  findDecisionsWithPagination,
  findAndReplaceDecision,
  findAndUpdateDecision,
  deleteDecision,
  PaginatedDecisions,
  Page
} from '../../connectors/sderDB'
import { logger } from '../../config/logger'
import { NotFound, NotSupported } from '../error'

function computeDates(now: Date, previousDecision: DecisionSupported | null) {
  return {
    firstImportDate: previousDecision
      ? (previousDecision.firstImportDate ?? undefined)
      : now.toISOString(),
    lastImportDate: now.toISOString(),
    publishDate: previousDecision?.publishDate ?? null,
    unpublishDate: previousDecision?.unpublishDate ?? null
  }
}

function computeUpsertEvents(
  now: Date,
  previousDecision: DecisionSupported | null,
  decision: UnIdentifiedDecisionSupported,
): DecisionSupported['events'] {
  return [
    ...(previousDecision?.events ?? []),
    {
      date: now,
      type: previousDecision ? 'recreated' : 'created',
      rawFileId: decision.rawFileSource,
      withStatus: { labelStatus: decision.labelStatus, publishStatus: decision.publishStatus }
    }
  ]
}

function computePatchEvents(
  now: Date,
  previousDecision: DecisionSupported,
  labelStatus?: DecisionSupported['labelStatus'],
  publishStatus?: DecisionSupported['publishStatus']
): DecisionSupported['events'] {
  return [
    ...(previousDecision?.events ?? []),
    {
      date: now,
      type: 'patched',
      withStatus: {
        labelStatus: labelStatus ?? previousDecision.labelStatus,
        publishStatus: publishStatus ?? previousDecision.publishStatus
      }
    }
  ]
}

export async function saveDecision(
  decision: UnIdentifiedDecisionSupported,
): Promise<Decision> {
  const now = new Date()
  const uniqueFilters = mapDecisionIntoUniqueFilters(decision)
  const previousDecision = await findDecision(uniqueFilters)

  if (previousDecision && !idDecisionSupported(previousDecision))
    throw new NotSupported('decision.sourceName', 'dila')

  const { firstImportDate, unpublishDate, publishDate, lastImportDate } = computeDates(
    now,
    previousDecision
  )
  const events = computeUpsertEvents(
    now,
    previousDecision,
    decision,
  )

  const decisionNormalized: UnIdentifiedDecisionSupported = {
    ...decision,
    firstImportDate,
    lastImportDate,
    publishDate,
    unpublishDate,
    events
  }

  const res = await findAndReplaceDecision(
    mapDecisionIntoUniqueFilters(decisionNormalized),
    decisionNormalized
  )

  if (res.labelStatus !== LabelStatus.TOBETREATED)
    logger.info({
      path: 'src/services/decision.ts',
      operations: ['normalization', 'saveDecision'],
      message: 'Saved decision will not be treated',
      decision: {
        _id: res._id?.toString(),
        sourceId: `${res.sourceId}`,
        sourceName: res.sourceName,
        labelStatus: res.labelStatus,
        publishStatus: res.publishStatus
      }
    })

  return res
}

export async function updateDecision(
  targetId: Decision['_id'],
  previousDecision: Decision,
  updateFields: UpdatableDecisionFields
): Promise<Decision> {
  const now = new Date()

  if (previousDecision && !idDecisionSupported(previousDecision))
    throw new NotSupported('decision.sourceName', 'dila')

  const events = computePatchEvents(
    now,
    previousDecision,
    updateFields.labelStatus,
    updateFields.publishStatus
  )

  const filter = { _id: targetId, sourceName: previousDecision.sourceName }
  const decision = await findAndUpdateDecision(filter, { ...updateFields, events })
  if (!decision)
    throw new NotFound(
      'Decision',
      `Decision missing for id: ${filter._id} and sourceName: ${filter.sourceName}`
    )
  return decision
}

export async function fetchDecisionById(decisionId: DecisionSupported['_id']): Promise<Decision> {
  const decision = await findDecision({ _id: decisionId })
  if (!decision) throw new NotFound('decision')
  return decision
}

export async function fetchDecisions(
  filters: DecisionListFilters,
  page: Page
): Promise<PaginatedDecisions> {
  return findDecisionsWithPagination(mapDecisionListFiltersIntoDbFilters(filters), page)
}

export async function deleteDecisionById(decisionId: Decision['_id']): Promise<boolean> {
  const decision = await findDecision({ _id: decisionId })
  if (!decision) throw new NotFound('decision')
  const deleted = await deleteDecision({ _id: decision._id })
  return deleted.deletedCount > 0
}
