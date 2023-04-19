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
    const res = apiKeyStrategy.validateApiKey(apiKey)

    // THEN
    expect(res).toBe(false)
  })

  it('validateApiKey returns true if the API key is from Label', async () => {
    // GIVEN
    const apiKey = process.env.LABEL_API_KEY

    // WHEN
    const res = apiKeyStrategy.validateApiKey(apiKey)

    // THEN
    expect(res).toBe(true)
  })
})
