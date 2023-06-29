import { HttpException, HttpStatus } from '@nestjs/common'

export class UnexpectedException extends HttpException {
  constructor(reason: string) {
    super(`Dbsder a rencontré une erreur : ${reason}`, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
