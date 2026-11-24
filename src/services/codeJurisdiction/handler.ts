import { NotFound } from '../error'
import {
  findCodeJurisdiction,
} from '../../connectors/sderDB'
import { CodeJurisdiction } from './codejurisdictions'

export async function fetchJurisdictionByCode(code: CodeJurisdiction['code']): Promise<CodeJurisdiction> {

  const codeJurisdiction = await findCodeJurisdiction({ code })
  if (!codeJurisdiction)
    throw new NotFound(`Le codeJurisdiction ${code} n'existe pas ou n'est pas en cours de validité.`)
  return codeJurisdiction
}
