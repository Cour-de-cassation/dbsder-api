export enum DecisionStatus {
  TO_BE_TREATED = 'toBeTreated',
  LOADED = 'loaded',
  DONE = 'done',
  EXPORTED = 'exported',
  BLOCKED = 'blocked',
  TOIGNORE = 'toIgnore',
  IGNORED_DECISIONNONPUBLIQUE = 'ignored_decisionNonPublique',
  IGNORED_DATEDECISIONINCOHERENTE = 'ignored_dateDecisionIncoherente'
}

export enum Sources {
  CC = 'CC',
  TJ = 'TJ',
  CA = 'CA'
}
