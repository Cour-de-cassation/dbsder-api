import { CodeNac } from 'dbsder-api-types'
import { NotFound, ExistingCodeNac } from '../../library/error'
import { findAllValidCodeNac, findCodeNac, findValidCodeNac, createNac } from '../../library/sderDB'
import { WithoutId } from 'mongodb'

export async function fetchCodeNacByCodeNac(codeNac: CodeNac['codeNAC']): Promise<CodeNac> {
  const codeNacDetails = await findValidCodeNac(codeNac)
  if (!codeNacDetails) throw new NotFound(`Le codenac ${codeNac} n'existe pas ou n'est pas en cours de validité.`)
  return codeNacDetails
}

export async function fetchAllValidCodeNac(): Promise<CodeNac[]> {
  const allValidCodeNacs = await findAllValidCodeNac()
  if (!allValidCodeNacs || allValidCodeNacs.length === 0) throw new NotFound('codeNacs')
  return allValidCodeNacs
}

export async function createCodeNac(codeNac: WithoutId<CodeNac>): Promise<CodeNac> {
  const existingCodeNac = await findCodeNac({ codeNAC: codeNac.codeNAC })
  if (existingCodeNac) {
    throw new ExistingCodeNac(`Le codenac ${codeNac.codeNAC} existe déjà.`)
  }
  return await createNac(codeNac)
}
