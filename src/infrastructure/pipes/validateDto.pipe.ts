import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { ArgumentMetadata, Injectable, Logger, PipeTransform } from '@nestjs/common'
import { MissingPropertiesException } from '../exceptions/missingProperties.exception'
import { MissingFieldException } from '../exceptions/missingField.exception'
import { DateMismatchException } from '../exceptions/dateMismatch.exception'

@Injectable()
export class ValidateDtoPipe implements PipeTransform {
  private readonly logger: Logger
  constructor() {
    this.logger = new Logger()
  }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    if (!value) {
      const error = new MissingFieldException('decision')
      this.logger.error({
        operationName: 'transform',
        msg: error.message,
        statusCode: error.getStatus()
      })
      throw error
    }
    const object = plainToInstance(metatype, value)
    if (object.startDate && object.endDate && object.startDate > object.endDate) {
      const error = new DateMismatchException("'startDate' doit être antérieur à 'endDate'.")
      this.logger.error({
        operationName: 'transform',
        msg: error.message,
        statusCode: error.getStatus()
      })

      throw error
    }
    const errors: ValidationError[] = await validate(object)
    if (errors.length > 0) {
      const missingProperties = errors.map((err) =>
        this.findPropertyNameInErrorMessage(err.toString(false))
      )
      const error = new MissingPropertiesException(missingProperties.join(', '))
      this.logger.error({
        operationName: 'transform',
        msg: error.message,
        statusCode: error.getStatus()
      })

      throw error
    }
    return value
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }

  findPropertyNameInErrorMessage(message): string {
    const cleanMessage: RegExpExecArray = /property (.*?) /g.exec(message)
    /* exemple d'output du RegexExecArray
        [
          'property dateDecision ',
          'dateDecision', <-- cette valeur nous intéresse
          index: 60,
          input: 'An instance of MetadonneesDto has failed the validation:\n' +
            ' - property dateDecision has failed the following constraints: isDateString, matches, isString \n',
          groups: undefined
        ]
    */
    return cleanMessage ? cleanMessage[1] : ''
  }
}
