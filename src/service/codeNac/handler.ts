import { CodeNac } from 'dbsder-api-types'
import { notFound } from '../../library/error'
import { findCodeNac } from '../../library/sderDB'

export async function fetchCodeNacByCodeNac(codeNac: CodeNac['codeNAC']): Promise<CodeNac> {
  const codeNacDetails = await findCodeNac({ codeNAC: codeNac })
  if (!codeNacDetails) throw notFound('codeNac', new Error())
  return codeNacDetails
}
