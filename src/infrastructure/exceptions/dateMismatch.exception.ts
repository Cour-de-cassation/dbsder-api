import { HttpException, HttpStatus } from '@nestjs/common'

export class DateMismatchError extends HttpException {
  constructor(reason: string) {
    super('Conflit de date : ' + reason, HttpStatus.BAD_REQUEST)
  }
}
