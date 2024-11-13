export enum DateType {
  DATEDECISION = 'dateDecision',
  DATECREATION = 'dateCreation'
}

export class DateTypeValidation {
  static isValidDateType(dateType: any): boolean {
    return Object.values(DateType).includes(dateType)
  }
}
