import { Affaire, UnIdentifiedAffaire } from 'dbsder-api-types'
import { createAffaire, findAffaire, updateAffaireById } from '../../library/sderDB'
import { AffaireSearchQuery, mapQueryIntoFilter } from './models'
import { NotFound, UnexpectedError } from '../../library/error'

export async function fetchAffaireByFilters(searchValues: AffaireSearchQuery): Promise<Affaire> {
  const [response, ...rest] = (await findAffaire(mapQueryIntoFilter(searchValues))) ?? []
  if (!response) throw new NotFound('response', 'affaires not found')
  if (rest.length > 0) {
    throw new UnexpectedError('More than 1 Affaire')
  }
  return response
}

export async function updateAffaire(
  id: Affaire['_id'],
  affaire: Partial<Affaire>
): Promise<Affaire> {
  return updateAffaireById(id, affaire)
}

export async function createAffaireHandler(affaire: UnIdentifiedAffaire): Promise<Affaire> {
  return await createAffaire(affaire)
}
