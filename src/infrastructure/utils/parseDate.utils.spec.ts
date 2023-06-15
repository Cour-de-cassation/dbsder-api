import { parseDate } from './parseDate.utils'

describe('ParseDate', () => {
  it('Should parse the date string correctly', () => {
    // GIVEN
    const unparsedDate = '2022-12-12'
    const expectedParsedDate = new Date(2022, 11, 12)

    // WHEN & THEN
    expect(parseDate(unparsedDate)).toEqual(expectedParsedDate)
  })
})
