import { ApiKeyValidation } from './apiKeyValidation'

describe('ApiKeyValidation', () => {
  let apiKeyValidation: ApiKeyValidation

  beforeAll(async () => {
    apiKeyValidation = new ApiKeyValidation()
  })

  it('returns false when provided API Key is not in valid API Key list', async () => {
    // GIVEN
    const apiKey = 'some-api-key'
    const authorizedApiKeys = ['some', 'valid', 'api', 'key']

    // WHEN
    const res = apiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)

    // THEN
    expect(res).toBe(false)
  })

  it('returns true when provided API Key is in valid API Key list', async () => {
    // GIVEN
    const apiKey = 'some-api-key'
    const authorizedApiKeys = ['some', 'valid', 'api', 'key', 'some-api-key']

    // WHEN
    const res = apiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)

    // THEN
    expect(res).toBe(true)
  })
})
