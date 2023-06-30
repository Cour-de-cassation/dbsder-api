import { HttpException, HttpStatus } from '@nestjs/common'

export class DecisionNotFoundException extends HttpException {
  constructor() {
    super("La decision n'a pas été trouvée", HttpStatus.NOT_FOUND)
  }
}
