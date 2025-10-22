import { Affaire } from 'dbsder-api-types'
import { updateAffaireById, findAffaire, createAffaire } from '../../library/sderDB'
import { AffaireSearchQuery, mapQueryIntoAffaire, mapQueryIntoFilter } from './models'

export async function fetchAffaireByFilters(searchValues: AffaireSearchQuery): Promise<Affaire> {
  const affaire = await findAffaire(mapQueryIntoFilter(searchValues))
  return affaire ?? createAffaire(mapQueryIntoAffaire(searchValues))
}

export async function updateAffaire(id: Affaire["_id"], affaire: Partial<Affaire>): Promise<Affaire> {
  return updateAffaireById(id, affaire)
}
