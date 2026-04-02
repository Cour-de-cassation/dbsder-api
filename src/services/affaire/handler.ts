import { createAffaire, findAffaire, updateAffaireById } from '../../connectors/sderDB'
import { Affaire, AffaireSearchQuery, mapQueryIntoFilter, UnIdentifiedAffaire } from './models'
import { NotFound, UnexpectedError } from '../error'
import { ObjectId } from 'mongodb'

export async function fetchAffaireByFilters(searchValues: AffaireSearchQuery): Promise<Affaire> {
  const [response, ...rest] = (await findAffaire(mapQueryIntoFilter(searchValues))) ?? []
  if (!response) throw new NotFound('response', 'affaires not found')
  if (rest.length > 0) {
    throw new UnexpectedError('More than 1 Affaire')
  }
  return response
}

export async function updateAffaire(id: ObjectId, affaire: Partial<Affaire>): Promise<Affaire> {
  return updateAffaireById(id, affaire)
}

export async function createAffaireHandler(affaire: UnIdentifiedAffaire): Promise<Affaire> {
  return await createAffaire(affaire)
}
