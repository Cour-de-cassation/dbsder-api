export class DatabaseError extends Error {
  constructor(reason: string) {
    super('Erreur dans la base de données : ' + reason)
  }
}

export class UpdateFailedError extends Error {
  constructor(reason: string) {
    super('Erreur lors de la mise à jour en base de données : ' + reason)
  }
}

export class DuplicateKeyError extends Error {
  constructor(idDuplique: string) {
    super(`${idDuplique} déjà utilisé pour une décision`)
  }
}

export const mongoDuplicateKeyErrorCode = '11000'
