import { HttpException, HttpStatus } from '@nestjs/common'

export class UnprocessableException extends HttpException {
  constructor(decisionId: string, value: string, reason: string) {
    super(
      `La mise à jour de la valeur "${value}" a échouée pour la décision "${decisionId}" : "${reason}"`,
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
