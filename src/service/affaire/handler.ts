import { Affaire } from 'dbsder-api-types'
import { createAffaire, findAffaire, updateAffaireById } from '../../library/sderDB'
import { AffaireSearchQuery, mapQueryIntoFilter } from './models'
import { WithoutId } from 'mongodb'

export async function fetchAffaireByFilters(
  searchValues: AffaireSearchQuery
): Promise<Affaire | null> {
  return await findAffaire(mapQueryIntoFilter(searchValues))
}

export async function updateAffaire(
  id: Affaire['_id'],
  affaire: Partial<Affaire>
): Promise<Affaire> {
  return updateAffaireById(id, affaire)
}

export async function createAffaireHandler(affaire: WithoutId<Affaire>): Promise<Affaire> {
  return await createAffaire(affaire)
}
