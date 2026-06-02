import { NextFunction, Request, Response } from 'express'
import { Service } from '../services/authentication'

describe('apiKeyToService', () => {
  let apiKeyToService: (apiKey: string) => Service
  let Service: typeof import('../services/authentication').Service
  let UnauthorizedError: typeof import('../services/error').UnauthorizedError

  beforeAll(async () => {
    process.env.INDEX_API_KEY = 'test-index-key'
    process.env.LABEL_API_KEY = 'test-label-key'
    process.env.JURINACS_API_KEY = 'test-jurinacs-key'

    jest.resetModules()

    const auth = await import('../services/authentication')
    const error = await import('../services/error')

    apiKeyToService = auth.apiKeyToService
    Service = auth.Service
    UnauthorizedError = error.UnauthorizedError
  })

  afterAll(() => {
    jest.resetModules()
    delete process.env.INDEX_API_KEY
    delete process.env.LABEL_API_KEY
    delete process.env.JURINACS_API_KEY
  })

  it('retourne le bon service pour chaque clé', () => {
    expect(apiKeyToService('test-index-key')).toBe(Service.INDEX)
    expect(apiKeyToService('test-label-key')).toBe(Service.LABEL)
    expect(apiKeyToService('test-jurinacs-key')).toBe(Service.JURINACS)
  })

  it('lève UnauthorizedError pour une clé inconnue', () => {
    expect(() => apiKeyToService('clé-inconnue')).toThrow(UnauthorizedError)
  })
})

describe('apiKeyHandler', () => {
  let apiKeyHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  let ForbiddenError: typeof import('../services/error').ForbiddenError

  beforeAll(async () => {
    process.env.INDEX_API_KEY = 'test-index-key'
    process.env.LABEL_API_KEY = 'test-label-key'
    process.env.JURINACS_API_KEY = 'test-jurinacs-key'

    jest.resetModules()

    const auth = await import('./authentication')
    const error = await import('../services/error')

    apiKeyHandler = auth.apiKeyHandler
    ForbiddenError = error.ForbiddenError
  })

  afterAll(() => {
    jest.resetModules()
    delete process.env.INDEX_API_KEY
    delete process.env.LABEL_API_KEY
    delete process.env.JURINACS_API_KEY
  })

  it('JURINACS — autorise /codenacs', async () => {
    const next = jest.fn() as unknown as NextFunction
    const req = {
      headers: { 'x-api-key': 'test-jurinacs-key' },
      path: '/codenacs',
      context: {}
    } as unknown as Request

    await apiKeyHandler(req, {} as Response, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('LABEL — autorise /decisions', async () => {
    const next = jest.fn() as unknown as NextFunction
    const req = {
      headers: { 'x-api-key': 'test-label-key' },
      path: '/decisions',
      context: {}
    } as unknown as Request

    await apiKeyHandler(req, {} as Response, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('JURINACS — bloque /decisions', async () => {
    const next = jest.fn() as unknown as NextFunction
    const req = {
      headers: { 'x-api-key': 'test-jurinacs-key' },
      path: '/decisions',
      context: {}
    } as unknown as Request

    await apiKeyHandler(req, {} as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError))
  })
})
