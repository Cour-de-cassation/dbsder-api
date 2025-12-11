import { DocumentAssocie, UnIdentifiedDocumentAssocie } from 'dbsder-api-types'
import { DocumentAssocieSearchQuery } from './models'
import { NotFound, UnexpectedError } from '../../library/error'
import {
  findDocumentAssocie,
  updateDocumentAssocieById,
  createDocumentAssocie
} from '../../library/sderDB'

export async function fetchDocumentAssocieByFilters(
  searchValues: DocumentAssocieSearchQuery
): Promise<DocumentAssocie[]> {
  const response = (await findDocumentAssocie(searchValues)) ?? []
  if (!response) throw new NotFound('response', 'documentAssocie not found')
  return response
}

export async function updateDocumentAssocie(
  id: DocumentAssocie['_id'],
  documentAssocie: Partial<DocumentAssocie>
): Promise<DocumentAssocie> {
  return updateDocumentAssocieById(id, documentAssocie)
}

export async function createDocumentAssocieHandler(
  documentAssocie: UnIdentifiedDocumentAssocie
): Promise<DocumentAssocie> {
  return await createDocumentAssocie(documentAssocie)
}
