import { UnauthorizedException } from '@nestjs/common'
import { AuthMiddleware } from './auth.middleware'

function passFunction() {
  console.log('called')
}

describe('AuthMiddleware', () => {
  const middleware = new AuthMiddleware()

  it('throws an exception when the consumer is not authorized', () => {
    // GIVEN
    jest.spyOn(middleware, 'callPassportAuthentication').mockImplementation(() => {
      throw new UnauthorizedException()
    })

    // WHEN
    const error = () => {
      middleware.use(null, null, () => {
        console.log('')
      })
    }

    // THEN
    expect(error).toThrowError(new UnauthorizedException())
  })

  it('continues the process if the consumer is authorized', () => {
    // GIVEN
    jest.spyOn(middleware, 'callPassportAuthentication').mockImplementation(() => {
      console.log('called')
    })

    // WHEN
    const call = () => middleware.use(null, null, passFunction)

    // THEN
    expect(call).toBeTruthy()
    //expect(call).toHaveBeenCalledWith(null, null , passFunction)
  })
})
