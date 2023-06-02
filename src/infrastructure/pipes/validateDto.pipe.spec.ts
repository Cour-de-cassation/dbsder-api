import { ValidateDtoPipe } from './validateDto.pipe'

describe('ValidateDTOPipe', () => {
  const pipe = new ValidateDtoPipe()

  describe('transform', () => {
    it('returns property id when the error message contains id', () => {
      // GIVEN
      const errorMessage =
        'An instance of CreateDecisionDTO has failed the validation:\n' +
        ' - property id has failed the following constraints: isString \n'

      // WHEN
      const result = pipe.findPropertyNameInErrorMessage(errorMessage)

      // THEN
      expect(result).toEqual('id')
    })

    it('returns an empty string when the error message is empty', () => {
      // GIVEN
      const errorMessage = ''

      // WHEN
      const result = pipe.findPropertyNameInErrorMessage(errorMessage)

      // THEN
      expect(result).toEqual('')
    })
  })
})
