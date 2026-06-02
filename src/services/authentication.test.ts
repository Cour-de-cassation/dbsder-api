import { INDEX_API_KEY, LABEL_API_KEY, JURINACS_API_KEY } from '../config/env'
import { Service } from '../services/authentication'
import { apiKeyToService } from '../services/authentication'
import { UnauthorizedError } from '../services/error'
describe('apiKeyToService', () => {
  it('retourne le bon service pour chaque clé', () => {
    expect(apiKeyToService(INDEX_API_KEY)).toBe(Service.INDEX)
    expect(apiKeyToService(LABEL_API_KEY)).toBe(Service.LABEL)
    expect(apiKeyToService(JURINACS_API_KEY)).toBe(Service.JURINACS)
  })

  it('lève UnauthorizedError pour une clé inconnue', () => {
    expect(() => apiKeyToService('clé-inconnue')).toThrow(UnauthorizedError)
  })
})
