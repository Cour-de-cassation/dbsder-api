import { DateType, DateTypeValidation } from './dateType.utils'

describe('Date type', () => {
  it('Should is valid date type', () => {
    expect(DateTypeValidation.isValidDateType(DateType.DATECREATION)).toBeTruthy()
  })

  it('Should is not valid date type', () => {
    expect(DateTypeValidation.isValidDateType('date')).toBeFalsy()
  })
})
