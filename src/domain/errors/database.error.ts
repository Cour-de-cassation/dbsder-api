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

export class DeleteFailedError extends Error {
  constructor(reason: string) {
    super('Erreur lors de la suppression en base de données : ' + reason)
  }
}

export class CreateFailedError extends Error {
  constructor(reason: string) {
    super('Erreur lors de la création en base de données : ' + reason)
  }
}
