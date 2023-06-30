import { HttpException, HttpStatus } from '@nestjs/common'

export class ForbiddenRouteException extends HttpException {
  constructor() {
    super("Vous n'avez pas accès à cette route", HttpStatus.FORBIDDEN)
  }
}
