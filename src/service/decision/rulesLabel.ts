// Warn: isolated because Label responsibility

import { Decision, LabelStatus, PublishStatus } from 'dbsder-api-types'
import { UpdatableDecisionFields } from './models'
import { findAndUpdateDecision } from '../../library/sderDB'
import { unexpectedError } from '../../library/error'

export async function updateDecisionForLabel(
  originalDecision: Decision,
  updateFields: Omit<UpdatableDecisionFields, 'labelStatus' | 'publishStatus'>
): Promise<Decision> {
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

  const filter = { _id: originalDecision._id, sourceName: originalDecision.sourceName }
  const decision = await findAndUpdateDecision(filter, {
    pseudoText: updateFields.pseudoText,
    labelTreatments: updatedLabelTreatments,
    labelStatus,
    publishStatus
  })

  if (!decision)
    throw unexpectedError(
      new Error(`Decision found with id: "${originalDecision._id}" but not found during update`)
    )
  return decision
}
