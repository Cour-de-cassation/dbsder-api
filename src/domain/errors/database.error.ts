export class DatabaseError extends Error {
  constructor(reason: string) {
    super('Erreur dans la base de données : ' + reason)
  }
}
