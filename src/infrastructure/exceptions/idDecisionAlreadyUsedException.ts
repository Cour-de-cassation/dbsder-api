import { HttpException, HttpStatus } from '@nestjs/common'

export class IdDecisionAlreadyUsedException extends HttpException {
  constructor(id: string) {
    super(`L'id de la decision existe déjà: ${id}`, HttpStatus.CONFLICT)
  }
}
