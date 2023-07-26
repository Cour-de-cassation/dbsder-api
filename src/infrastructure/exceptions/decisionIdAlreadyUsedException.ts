import { HttpException, HttpStatus } from '@nestjs/common'

export class DecisionIdAlreadyUsedException extends HttpException {
  constructor(id: string) {
    super(`L'ID de la decision existe déjà: ${id}`, HttpStatus.CONFLICT)
  }
}
