/**
 *
 * Checklist :
 *
 * - si on reçoit bien la decision => J'arrive a envoyer ma decision à l'API
 * - on envoie bien la donnée a la DB + si la db arrive bien a enregistré => Je m'assure que la décision s'enregistre en DB
 * - J'ai une erreur de la part de l'API lors d'un dysfonctionnement de la DB
 */

import { MockUtils } from '../../infrastructure/utils/mock.utils'
import { CreateDecisionUsecase } from './createDecision.usecase'

describe('createDecisionUsecase', () => {
  const mockUtils = new MockUtils()
  const usecase = new CreateDecisionUsecase()
  it("J'arrive à envoyer ma décision à l'API", () => {
    // GIVEN
    const decision = mockUtils.createDecisionDTO

    // WHEN
    const result = usecase.execute(decision)

    // THEN
    expect(result).toEqual('executed')
  })

  // it("Je m'assure que la décision s'enregristre en DB", () => {
  //       // GIVEN
  //       const decision = mockUtils.createDecisionDTO

  //       // WHEN
  //       const result = usecase.execute(decision)

  //       // THEN
  //       expect(result)
  // })
})
