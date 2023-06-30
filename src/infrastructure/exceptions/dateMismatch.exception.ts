import { HttpException, HttpStatus } from '@nestjs/common'

export class DateMismatchException extends HttpException {
  constructor(reason: string) {
    super('Conflit de date : ' + reason, HttpStatus.BAD_REQUEST)
  }
}
