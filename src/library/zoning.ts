import { ZONING_API_URL } from './env'
import { toNotSupported, UnexpectedError } from './error'
import axios, { AxiosError } from 'axios'

export type ZoningParameters = {
  arret_id: number
  source: 'tj' | 'ca' | 'cc' | 'tcom'
  text: string
}

export type ZoningReponse = { [k: string]: unknown }

export async function fetchZoning(parameters: ZoningParameters): Promise<ZoningReponse> {
  try {
    const result = await axios<{ data: ZoningReponse }>({
      data: parameters,
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: `${ZONING_API_URL}/zonage`
    })
    return result.data
  } catch (err) {
    if (!(err instanceof AxiosError)) throw new UnexpectedError()
    if (
      err instanceof AxiosError &&
      err.response &&
      err.response.status &&
      err.response.status < 400 &&
      err.response.status >= 500
    )
      throw new UnexpectedError('Zoning service is currently unavailable')

    throw toNotSupported('zoning parameters', parameters, err)
  }
}
