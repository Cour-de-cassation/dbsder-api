import { CodeNac } from 'dbsder-api-types'
import { ExistingCodeNac, NotFound } from '../../library/error'
import {
  createNAC,
  deleteCodeNAC,
  findCodeNac,
  findEveryByNAC,
  findEveryNACBySubChapter,
  findEveryValidCodeNAC,
  findValidCodeNAC,
  updateNacById
} from '../../library/sderDB'
import { Filter, WithoutId } from 'mongodb'

export async function fetchCodeNacByNac(codeNac: CodeNac['codeNAC']): Promise<CodeNac> {
  const codeNacDetails = await findValidCodeNAC(codeNac)
  if (!codeNacDetails)
    throw new NotFound(`Le codenac ${codeNac} n'existe pas ou n'est pas en cours de validité.`)
  return codeNacDetails
}

export async function fetchEveryCodeNacByNac(codeNac: CodeNac['codeNAC']): Promise<CodeNac[]> {
  const codeNacDetails = await findEveryByNAC(codeNac)
  if (!codeNacDetails || codeNacDetails.length === 0)
    throw new NotFound(`Le codenac ${codeNac} n'existe pas ou n'est pas en cours de validité.`)
  return codeNacDetails
}

export async function fetchEveryValidCodeNac(filters: Filter<CodeNac>): Promise<CodeNac[]> {
  const allValidCodeNacs = await findEveryValidCodeNAC(filters)
  if (!allValidCodeNacs || allValidCodeNacs.length === 0) throw new NotFound('codeNacs')
  return allValidCodeNacs
}

export async function createCodeNac(
  codeNac: WithoutId<Partial<CodeNac>>
): Promise<Partial<CodeNac>> {
  const existingCodeNac = await findCodeNac({ codeNAC: codeNac.codeNAC, dateFinValidite: null })
  if (existingCodeNac) {
    throw new ExistingCodeNac(
      existingCodeNac.codeNAC,
      existingCodeNac.dateFinValidite?.toISOString() ?? '',
      existingCodeNac.codeUsageNonConseille
    )
  }
  return await createNAC(codeNac)
}

export async function updateNacIfExistsOrCreate(
  codeNac: WithoutId<CodeNac>,
  nac: string
): Promise<Partial<CodeNac>> {
  // Recherche d'un Code NAC existant
  const existingCodeNac = await findCodeNac({ codeNAC: nac, dateFinValidite: null })

  if (!existingCodeNac) {
    throw new NotFound(`Le code NAC ${codeNac.codeNAC} n'existe pas.`)
  }

  const updatedExistingCodeNac: CodeNac = {
    ...existingCodeNac,
    dateFinValidite: new Date(),
    codeUsageNonConseille: true
  }

  await updateNacById(existingCodeNac._id, updatedExistingCodeNac)

  return createNAC(codeNac)
}

export async function deleteCodeNac(codeNac: CodeNac['codeNAC']): Promise<string> {
  const deletedCodeNac = await deleteCodeNAC(codeNac)
  return `Le codenac ${deletedCodeNac.codeNAC} a été supprimé`
}

export async function fetchEverySubChapter(
  code: CodeNac['sousChapitre']['code']
): Promise<CodeNac[]> {
  const everySubChapterNAC = await findEveryNACBySubChapter(code)
  return everySubChapterNAC
}
