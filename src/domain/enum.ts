export enum DecisionStatus {
  TOBETREATED = 'toBeTreated',
  LOADED = 'loaded',
  DONE = 'done',
  EXPORTED = 'exported',
  BLOCKED = 'blocked',
  IGNORED_DECISION_NON_PUBLIQUE = 'ignored_decisionNonPublique',
  IGNORED_DATE_DECISION_INCOHERENTE = 'ignored_dateDecisionIncoherente',
  IGNORED_CODE_NAC_NON_TRANSMIS_CC = 'ignored_codeNACnonTransmisCC',
  IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE = 'ignored_codeNACdeDecisionNonPublique',
  IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE = 'ignored_codeNACdeDecisionPartiellementPublique'
}

export enum Sources {
  CC = 'CC',
  TJ = 'TJ',
  CA = 'CA'
}
