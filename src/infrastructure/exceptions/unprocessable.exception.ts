import { HttpException, HttpStatus } from '@nestjs/common'

export class UnprocessableException extends HttpException {
  constructor(decisionId: string, statut: string, reason: string) {
    super(
      `La mise à jour du statut de la décision ${decisionId} a échouée pour le statut ${statut} : ${reason}`,
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
