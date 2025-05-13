import { CodeNac } from 'dbsder-api-types'
import { notFound } from '../../library/error'
import { findCodeNac } from '../../library/sderDB'

export async function fetchCodeNacById(codeNacId: CodeNac['_id']): Promise<CodeNac> {
  const codeNac = await findCodeNac({ _id: codeNacId })
  if (!codeNac) throw notFound('codeNac', new Error())
  return codeNac
}
