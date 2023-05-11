import { ApiKeyStrategy } from './apiKey.strategy'

describe('ApiKeyStrategy', () => {
  let apiKeyStrategy: ApiKeyStrategy

  beforeAll(async () => {
    apiKeyStrategy = new ApiKeyStrategy()
  })

  it('validateApiKey returns false if the API key is unknown', async () => {
    // GIVEN
    const apiKey = 'toto'

    // WHEN
    const res = apiKeyStrategy.isApiKeyValid(apiKey)

    // THEN
    expect(res).toBe(false)
  })

  it('validateApiKey returns true if the API key is from Label', async () => {
    // GIVEN
    const apiKey = process.env.LABEL_API_KEY

    // WHEN
    const res = apiKeyStrategy.isApiKeyValid(apiKey)

    // THEN
    expect(res).toBe(true)
  })

  it('validateApiKey returns true if the API key is from JuriTJ-Normalisation', async () => {
    // GIVEN
    const apiKey = process.env.NORMALIZATION_API_KEY

    // WHEN
    const res = apiKeyStrategy.isApiKeyValid(apiKey)

    // THEN
    expect(res).toBe(true)
  })

  it('validateApiKey returns true if the API key is from OpenSder', async () => {
    // GIVEN
    const apiKey = process.env.OPENSDER_API_KEY

    // WHEN
    const res = apiKeyStrategy.isApiKeyValid(apiKey)

    // THEN
    expect(res).toBe(true)
  })
})
