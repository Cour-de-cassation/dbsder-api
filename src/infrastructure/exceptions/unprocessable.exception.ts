import { HttpException, HttpStatus } from '@nestjs/common'

export class UnprocessableException extends HttpException {
  constructor(decisionId: string, reason: string) {
    super(
      `Le traitement de la décision "${decisionId}" a échoué: "${reason}"`,
      HttpStatus.UNPROCESSABLE_ENTITY
    )
  }
}
