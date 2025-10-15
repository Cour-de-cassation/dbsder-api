import { Decision, DecisionDila, LabelStatus } from 'dbsder-api-types'
import {
  DecisionListFilters,
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
  PaginatedDecisions,
  Page
} from '../../library/sderDB'
import { logger } from '../../library/logger'
import { NotFound } from '../../library/error'

function computeDates(previousDecision: Exclude<Decision, DecisionDila> | null) {
  const now = new Date()
  return {
    firstImportDate: previousDecision
      ? (previousDecision.firstImportDate ?? undefined)
      : now.toISOString(),
    lastImportDate: now.toISOString(),
    publishDate: previousDecision?.publishDate ?? null,
    unpublishDate: previousDecision?.unpublishDate ?? null
  }
}

export async function saveDecision(decision: UnIdentifiedDecisionSupported): Promise<Decision> {
  const uniqueFilters = mapDecisionIntoUniqueFilters(decision)
  const previousDecision = (await findDecision(uniqueFilters)) as Exclude<Decision, DecisionDila> // decision cannot coming from dila
  const { firstImportDate, unpublishDate, publishDate, lastImportDate } =
    computeDates(previousDecision)

  const decisionNormalized: UnIdentifiedDecisionSupported = {
    ...decision,
    firstImportDate,
    lastImportDate,
    publishDate,
    unpublishDate
  }

  const res = await findAndReplaceDecision(
    mapDecisionIntoUniqueFilters(decisionNormalized),
    decisionNormalized
  )

  if (res.labelStatus !== LabelStatus.TOBETREATED)
    logger.info({
      path: 'src/service/decision.ts',
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
  sourceName: Decision['sourceName'],
  updateFields: UpdatableDecisionFields
): Promise<Decision> {
  const filter = { _id: targetId, sourceName }
  const decision = await findAndUpdateDecision(filter, updateFields)
  if (!decision)
    throw new NotFound(
      'Decision',
      `Decision missing for id: ${filter._id} and sourceName: ${filter.sourceName}`
    )
  return decision
}

export async function fetchDecisionById(decisionId: Decision['_id']): Promise<Decision> {
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
