import {
  Decision,
  DecisionDila,
  hasSourceNameTj,
  LabelStatus,
  PublishStatus
} from 'dbsder-api-types'
import { fetchZoning } from '../../library/zoning'
import {
  DecisionListFilters,
  mapDecisionIntoUniqueFilters,
  mapDecisionIntoZoningParameters,
  mapDecisionListFiltersIntoDbFilters,
  UnIdentifiedDecisionSupported,
  UpdatableDecisionFields
} from './models'
import { computeRulesDecisionTj } from './rulesTj'
import {
  findDecision,
  findDecisionsWithPagination,
  findAndReplaceDecision,
  findAndUpdateDecision,
  PaginatedDecisions,
  Page
} from '../../library/sderDB'
import { logger } from '../../library/logger'
import { NotFound, toUnexpectedError, UnexpectedError } from '../../library/error'

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

async function computeZoning(
  decision: UnIdentifiedDecisionSupported
): Promise<UnIdentifiedDecisionSupported['originalTextZoning']> {
  try {
    const zoning = await fetchZoning(mapDecisionIntoZoningParameters(decision))
    return zoning
  } catch (err) {
    const normalizedError =
      err instanceof Error ? toUnexpectedError(err) : new UnexpectedError('Zoning has been failed')
    logger.warn({
      operationName: 'computeZoning',
      msg: normalizedError.message,
      err
    })
    throw normalizedError
  }
}

export async function saveDecision(decision: UnIdentifiedDecisionSupported): Promise<Decision> {
  const uniqueFilters = mapDecisionIntoUniqueFilters(decision)
  const previousDecision = (await findDecision(uniqueFilters)) as Exclude<Decision, DecisionDila> // decision cannot coming from dila
  const { firstImportDate, unpublishDate, publishDate, lastImportDate } =
    computeDates(previousDecision)

  const originalTextZoning = await computeZoning(decision)

  const decisionWithZoning: UnIdentifiedDecisionSupported = {
    ...decision,
    originalTextZoning
  }

  const decisionWithRules = hasSourceNameTj(decisionWithZoning)
    ? await computeRulesDecisionTj(decisionWithZoning)
    : decisionWithZoning

  const decisionNormalized: UnIdentifiedDecisionSupported = {
    ...decisionWithRules,
    firstImportDate,
    lastImportDate,
    publishDate,
    unpublishDate,
    // warn: next line could be not true and should manage by normalization during status computation
    publishStatus:
      decisionWithRules.labelStatus !== LabelStatus.TOBETREATED
        ? PublishStatus.BLOCKED
        : PublishStatus.TOBEPUBLISHED
  }

  const res = await findAndReplaceDecision(
    mapDecisionIntoUniqueFilters(decisionNormalized),
    decisionNormalized
  )

  if (res.labelStatus !== LabelStatus.TOBETREATED)
    logger.warn({
      operationName: 'saveDecision',
      msg: 'Saved decision will not be treated',
      decision: {
        _id: res._id,
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

// Warn: isolated because Label responsibility
export { updateDecisionForLabel } from './rulesLabel'
