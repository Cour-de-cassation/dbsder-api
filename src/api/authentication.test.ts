import { NextFunction, Request, Response } from 'express'
import { apiKeyHandler } from './authentication'
import { ForbiddenError } from '../services/error'
import { JURINACS_API_KEY, LABEL_API_KEY } from '../config/env'
describe('apiKeyHandler', () => {
  const buildRequest = (apiKey: string, path: string): Request =>
    ({
      headers: { 'x-api-key': apiKey },
      path,
      context: {}
    }) as unknown as Request

  it('JURINACS — autorise /codenacs', async () => {
    const next = jest.fn() as unknown as NextFunction
    const req = buildRequest(JURINACS_API_KEY, '/codenacs')

    await apiKeyHandler(req, {} as Response, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('LABEL — autorise /decisions', async () => {
    const next = jest.fn() as unknown as NextFunction
    const req = buildRequest(LABEL_API_KEY, '/decisions')

    await apiKeyHandler(req, {} as Response, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('JURINACS — bloque /decisions', async () => {
    const next = jest.fn() as unknown as NextFunction
    const req = buildRequest(JURINACS_API_KEY, '/decisions')

    await apiKeyHandler(req, {} as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError))
  })
})
