import { Affaire, isPartialValidAffaire, parseId } from 'dbsder-api-types'
import { NotFound, UnexpectedError } from '../../library/error'
import { updateAffaireById, findAffaire } from '../../library/sderDB'
import { affaireSearchType } from './models'

//find affaire by filters decisionIf in ["id1","id2"] or numeroPourvoi in ["num1","num2"]
export async function fetchAffaireByFilters(searchValues: affaireSearchType): Promise<Affaire> {
  const affaire = await findAffaire(searchValues)
  if (!affaire) throw new NotFound('affaire with given filters not found')
  return affaire
}

// update affaire if exists
export async function updateAffaire(affaire: Partial<Affaire>, _id: string): Promise<Affaire> {
  if (!isPartialValidAffaire(affaire))
    throw new UnexpectedError('partial affaire to update is not valid, cannot update it')
  const updatedAffaire = await updateAffaireById(parseId(_id), affaire)
  if (!updatedAffaire)
    throw new NotFound(`affaire with id ${affaire._id} not found, cannot update it`)
  return updatedAffaire
}
