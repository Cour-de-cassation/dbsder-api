import { ApiKeyStrategy } from './apiKey.strategy'

let apiKeyStrategy

describe('ApiKeyStrategy', () => {
  beforeAll(async () => {
    apiKeyStrategy = new ApiKeyStrategy()
  })

  it('validateApiKey returns false if the API key is unknown', async () => {
    // GIVEN
    const apiKey = 'toto'

    // WHEN
    const res = apiKeyStrategy.validateApiKey(apiKey, 'GET')

    // THEN
    expect(res).toBe(false)
  })
})
