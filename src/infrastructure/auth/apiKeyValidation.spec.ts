import { ApiKeyValidation } from './apiKeyValidation'

describe('ApiKeyValidation', () => {
  it('returns false when provided API Key is not in valid API Key list', async () => {
    // GIVEN
    const apiKey = 'some-api-key'
    const authorizedApiKeys = ['some', 'valid', 'api', 'key']

    // WHEN
    const res = ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)

    // THEN
    expect(res).toBe(false)
  })

  it('returns true when provided API Key is in valid API Key list', async () => {
    // GIVEN
    const apiKey = 'some-api-key'
    const authorizedApiKeys = ['some', 'valid', 'api', 'key', 'some-api-key']

    // WHEN
    const res = ApiKeyValidation.isValidApiKey(authorizedApiKeys, apiKey)

    // THEN
    expect(res).toBe(true)
  })
})
