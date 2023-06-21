export class DatabaseError extends Error {
  constructor(reason: string) {
    super('Erreur dans la db : ' + reason)
  }
}
