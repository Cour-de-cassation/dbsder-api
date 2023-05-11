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
  describe('handle api keys per route', () => {
    it('as label i cannot post a decision', () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY
      const calledMethod = 'POST'
      const calledPath = '/decisions'

      // WHEN

      const result = apiKeyStrategy.handleApiKey(labelApiKey, calledMethod, calledPath)

      // THEN
      expect(result).toEqual('error')
    })

    it('as label i can get a decision list', () => {
      // GIVEN
      const labelApiKey = process.env.LABEL_API_KEY
      const calledMethod = 'GET'
      const calledPath = '/decisions'

      // WHEN

      const result = apiKeyStrategy.handleApiKey(labelApiKey, calledMethod, calledPath)

      // THEN
      expect(result).toEqual('ok')
    })

    it('as normalization i can post a decision', () => {
      // GIVEN
      const labelApiKey = process.env.NORMALIZATION_API_KEY
      const calledMethod = 'POST'
      const calledPath = '/decisions'

      // WHEN

      const result = apiKeyStrategy.handleApiKey(labelApiKey, calledMethod, calledPath)

      // THEN
      expect(result).toEqual('ok')
    })
  })
})
