import { Affaire, isPartialValidAffaire, parseId, UnIdentifiedAffaire } from 'dbsder-api-types'
import { NotFound, UnexpectedError } from '../../library/error'
import { createAffaire, updateAffaireById, findAffaire } from '../../library/sderDB'
import { Filter } from 'mongodb'

export async function saveAffaire(affaire: UnIdentifiedAffaire): Promise<Affaire> {
  const savedAffaire = await createAffaire(affaire)
  if (!savedAffaire)
    throw new UnexpectedError('Upsert behave like there were no affaire and cannot create')
  return savedAffaire
}

//find affaire by filters decisionIf in ["id1","id2"] or numeroPourvoi in ["num1","num2"]
export async function fetchAffaireByFilters(filters: Filter<Affaire>): Promise<Affaire> {
  const affaire = await findAffaire(filters)
  if (!affaire) throw new NotFound('affaire with given filters not found')
  return affaire
}

// update affaire if exists
export async function updateAffaire(affaire: Partial<Affaire>, _id: string): Promise<Affaire> {
  if (!isPartialValidAffaire(affaire))
    throw new UnexpectedError('partial affaire to update is not valid, cannot update it')
  const updatedAffaire = await updateAffaireById(parseId(_id), affaire)
  console.log('updatedAffaire', updatedAffaire)
  if (!updatedAffaire)
    throw new NotFound(`affaire with id ${affaire._id} not found, cannot update it`)
  return updatedAffaire
}
