// Warn: isolated because Label responsibility

import { Decision, LabelStatus, PublishStatus } from 'dbsder-api-types'
import { UpdatableDecisionFields } from './models'
import { findAndUpdateDecision, findDecision } from '../../library/sderDB'
import { notFound } from '../../library/error'

export async function updateDecisionForLabel(
  targetId: Decision['_id'],
  sourceName: Decision['sourceName'],
  updateFields: Omit<UpdatableDecisionFields, 'labelStatus' | 'publishStatus'>
): Promise<Decision> {
  const originalDecision = await findDecision({
    _id: targetId
  })
  if (!originalDecision) throw notFound('original decision', new Error())

  const labelStatus = LabelStatus.DONE
  const publishStatus =
    originalDecision.publishStatus === PublishStatus.BLOCKED
      ? PublishStatus.BLOCKED
      : PublishStatus.TOBEPUBLISHED

  const originalTreatments = originalDecision?.labelTreatments ?? []
  const updatedLabelTreatments = updateFields.labelTreatments
    ? [
        ...originalTreatments,
        ...updateFields.labelTreatments.map(({ order, ..._ }) => ({
          ..._,
          order: originalTreatments.length + order
        }))
      ]
    : originalTreatments

  const filter = { _id: targetId, sourceName }
  const decision = await findAndUpdateDecision(
    filter,
    {
      pseudoText: updateFields.pseudoText,
      labelTreatments: updatedLabelTreatments,
      labelStatus,
      publishStatus
    }
  )

  if (!decision) throw notFound("Decision", new Error(`Decision missing for ${JSON.stringify(filter)}`))
  return decision
}
