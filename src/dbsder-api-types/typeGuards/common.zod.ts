import { record, z } from 'zod'
import { ObjectId } from 'bson'

export enum LabelStatus {
  WAITING_FOR_AFFAIRE_RESOLUTION = 'waitingForAffaireResolution',
  TOBETREATED = 'toBeTreated',
  LOADED = 'loaded',
  DONE = 'done',
  EXPORTED = 'exported',
  BLOCKED = 'blocked',
  IGNORED_DEBAT_NON_PUBLIC = 'ignored_debatNonPublic',
  IGNORED_DECISION_NON_PUBLIQUE = 'ignored_decisionNonPublique',
  IGNORED_CODE_DECISION_BLOQUE_CC = 'ignored_codeDecisionBloqueCC',
  IGNORED_DATE_DECISION_INCOHERENTE = 'ignored_dateDecisionIncoherente',
  IGNORED_CODE_NAC_DECISION_NON_PUBLIQUE = 'ignored_codeNACdeDecisionNonPublique',
  IGNORED_CODE_NAC_DECISION_PARTIELLEMENT_PUBLIQUE = 'ignored_codeNACdeDecisionPartiellementPublique',
  IGNORED_CODE_NAC_INCONNU = 'ignored_codeNACInconnu',
  IGNORED_CARACTERE_INCONNU = 'ignored_caractereInconnu',
  IGNORED_DATE_AVANT_MISE_EN_SERVICE = 'ignored_dateAvantMiseEnService',
  IGNORED_CONTROLE_REQUIS = 'ignored_controleRequis',
  IGNORED_DECISION_NON_PUBLIQUE_PAR_ZONAGE = 'ignored_decisionNonPubliqueParZonage',
  IGNORED_DECISION_PARTIELLEMENT_PUBLIQUE_PAR_ZONAGE = 'ignored_decisionPartiellementPubliqueParZonage',
  IGNORED_BLOC_OCCULATION_NON_DEFINI = 'ignored_blocOcculationNonDefini',
  IGNORED_RECOMMANDATION_OCCULTATION_NON_SUIVIE = 'ignored_recommandationOccultationNonSuivie',
  IGNORED_MOTIFS_SECRET_AFFAIRE = 'ignored_motifsSecretAffaires',
  LOCKED = 'locked'
}

export enum PublishStatus {
  TOBEPUBLISHED = 'toBePublished',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE_PREPARING = 'failure_preparing',
  FAILURE_INDEXING = 'failure_indexing',
  BLOCKED = 'blocked',
  UNPUBLISHED = 'unpublished'
}

export enum Category {
  ADRESSE = 'adresse',
  CADASTRE = 'cadastre',
  PERSONNEMORALE = 'personneMorale',
  PERSONNEPHYSIQUE = 'personnePhysique',
  PROFESSIONNELAVOCAT = 'professionnelAvocat',
  PROFESSIONNELMAGISTRATGREFFIER = 'professionnelMagistratGreffier',
  DATENAISSANCE = 'dateNaissance',
  DATEDECES = 'dateDeces',
  DATEMARIAGE = 'dateMariage',
  INSEE = 'insee',
  NUMEROIDENTIFIANT = 'numeroIdentifiant',
  PLAQUEIMMATRICULATION = 'plaqueImmatriculation',
  COMPTEBANCAIRE = 'compteBancaire',
  LOCALITE = 'localite',
  NUMEROSIRETSIREN = 'numeroSiretSiren',
  SITEWEBSENSIBLE = 'siteWebSensible',
  ETABLISSEMENT = 'etablissement',
  TELEPHONEFAX = 'telephoneFax',
  EMAIL = 'email',
  MOTIVATIONS = 'motivations',
  ANNOTATIONSUPPLEMENTAIRE = 'annotationSupplementaire',
  PERSONNEPHYSIQUENOM = 'personnePhysiqueNom',
  PERSONNEPHYSIQUEPRENOM = 'personnePhysiquePrenom',
  PROFESSIONNELNOM = 'professionnelNom',
  PROFESSIONNELPRENOM = 'professionnelPrenom',
  PERSONNEPHYSICOMORALE = 'personnePhysicoMorale',
  PERSONNEGEOMORALE = 'personneGeoMorale',
  CUSTOM = 'custom'
}

export enum PseudoStatus {
  A_PSEUDONYMISER = 0,
  EN_COURS_DE_PSEUDONYMISATION = 1,
  PSEUDONYMISE = 2,
  MIS_EN_DOUTE = 3,
  ERREUR = 4
}

export enum SuiviOccultation {
  AUCUNE = 'aucune',
  CONFORME = 'conforme',
  SUBSTITUANT = 'substituant',
  COMPLEMENT = 'complément'
}

export enum QualitePartieExhaustive {
  F = 'F',
  G = 'G',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N'
}

export enum TypePartieExhaustive {
  PP = 'PP',
  PM = 'PM',
  AA = 'AA',
  NA = 'NA'
}

export enum BlocOccultation {
  CODE_NAC_NON_VALIDE = 0,
  TOUTES_CATAGORIES = 1,
  TOUTES_CATEGORIES_SAUF_DATES = 2,
  TOUTES_CATEGORIES_SAUF_PERSONNES_MORALES = 3,
  TOUTES_CATEGORIES_SAUF_DATES_ET_PERSONNES_MORALES = 4
}

export enum LabelRoute {
  DOUBLE_RELECTURE = 'double',
  RELECTURE_SYSTEMATIQUE = 'systematique',
  RELECTURE_ALEATOIRE_DE_DECISIONS_SENSIBLES = 'aleatoireSensible',
  RELECTURE_ALEATOIRE_DE_DECISIONS_NON_SENSIBLES = 'aleatoireNonSensible',
  PAS_DE_RELECTURE = 'automatique'
}

export enum RaisonInteretParticulier {
  F1_QUESTION_PREJUDICIELLE = 'F1 - Question préjudicielle',
  F2_QUESTION_PRIORITAIRE_CONSTITUTIONNALITE = 'F2 - Question prioritaire de constitutionnalité',
  F3_SAISINE_TRIBUNAL_CONFLITS = 'F3 - Saisine du Tribunal des conflits',
  S1_CONTROLE_CONVENTIONALITE = 'S1 - Contrôle de conventionalité',
  S2_CONTENTIEUX_EMERGENT_QUESTION_NOUVELLE = 'S2 - Contentieux émergent ou question de droit nouvelle',
  S3_DIVERGENCE_JURISPRUDENCE_DEBAT_DOCTRINAL = 'S3 - Divergence de jurisprudence ou débat doctrinal',
  S4_SUJET_INTERET_PUBLIC_MAJEUR = "S4 - Sujet d'intérêt public majeur",
  S5_CONTENTIEUX_RARE = 'S5 - Contentieux rare',
  S6_CONTENTIEUX_SERIEL = 'S6 - Contentieux sériel',
  C0_ANNOTATION_COUR_CASSATION = 'C0 - Décision annotée comme présentant un intérêt juridique particulier par la Cour de cassation'
}

export enum DecisionsPubliques {
  DECISIONS_PUBLIQUES = 'décisions publiques',
  DECISIONS_NON_PUBLIQUES = 'décisions non publiques',
  DECISIONS_MIXTES = 'décisions mixtes'
}

export enum DebatsPublics {
  DEBATS_PUBLICS = 'débats publics',
  DEBATS_NON_PUBLICS = 'débats non publics',
  DEBATS_MIXTES = 'débats mixtes'
}

export const zDecisionsPubliques = z.enum(DecisionsPubliques)
export const zDebatsPublics = z.enum(DebatsPublics)

export const zLabelStatus = z.enum(LabelStatus)

export const zPublishStatus = z.enum(PublishStatus)

const zCategory = z.enum(Category)

const zEntity = z.object({
  entityId: z.string(),
  text: z.string(),
  start: z.number().or(z.nan()),
  end: z.number().or(z.nan()).optional(),
  category: zCategory,
  score: z.number().or(z.nan()).optional().nullable(),
  certaintyScore: z.number().or(z.nan()).optional().nullable(),
  source: z.string().optional().nullable()
})
export type Entity = z.infer<typeof zEntity>

const zSentenceIndex = z.object({
  start: z.number().or(z.nan()),
  end: z.number().or(z.nan())
})
export type SentenceIndex = z.infer<typeof zSentenceIndex>

const zCheck = z.object({
  check_type: z.string(),
  message: z.string(),
  short_message: z.string(),
  entities: z.array(zEntity),
  sentences: z.array(zSentenceIndex),
  metadata_text: z.array(z.string()),
  _rank: z.number().or(z.nan()).nullable().optional()
})
export type Check = z.infer<typeof zCheck>

const zNLPVersionDetails = z.object({
  version: z.string(),
  date: z.string()
})
export type NLPVersionDetails = z.infer<typeof zNLPVersionDetails>

const zModelName = z.object({
  name: z.string()
})
export type ModelName = z.infer<typeof zModelName>

const zNLPVersion = z.object({
  juriSpacyTokenizer: zNLPVersionDetails,
  juritools: zNLPVersionDetails,
  pseudonymisationApi: zNLPVersionDetails.optional(),
  nlpApi: zNLPVersionDetails.optional(),
  model: zModelName
})
export type NLPVersion = z.infer<typeof zNLPVersion>

export const zLabelTreatments = z.array(
  z.object({
    order: z.number().or(z.nan()),
    annotations: z.array(zEntity),
    source: z.string(),
    version: zNLPVersion.optional().nullable(),
    treatmentDate: z.string().optional(),
    checklist: z.array(zCheck).optional()
  })
)
export type LabelTreatments = z.infer<typeof zLabelTreatments>

export const zPseudoStatus = z.enum(PseudoStatus)

export const zOccultation = z.object({
  additionalTerms: z.string(),
  additionalTermsToAnnotate: z.array(z.string()).optional(),
  additionalTermsToUnAnnotate: z.array(z.string()).optional(),
  categoriesToOmit: z.array(zCategory),
  motivationOccultation: z.boolean().optional()
})
export type Occultation = z.infer<typeof zOccultation>

export const zSuiviOccultation = z.enum(SuiviOccultation)

export const zQualitePartie = z.enum(QualitePartieExhaustive)
export type QualitePartie = z.infer<typeof zQualitePartie>

export const zTypePartie = z.enum(TypePartieExhaustive)
export type TypePartie = z.infer<typeof zTypePartie>

export const zBlocOccultation = z.enum(BlocOccultation)

export const zLabelRoute = z.enum(LabelRoute)

export const zRaisonInteretParticulier = z.enum(RaisonInteretParticulier)

export const zObjectId = z
  .string()
  .refine((id: string) => {
    return ObjectId.isValid(id) && new ObjectId(id).toString() === id
  })

export type DbsderId = z.infer<typeof zObjectId>

export const zZoneRange = z.object({
  start: z.number(),
  end: z.number()
})
export type ZoneRange = z.infer<typeof zZoneRange>

export const zZoningZones = z.object({
  introduction: zZoneRange.optional().nullable(),
  moyens: z.array(zZoneRange).optional(),
  'expose du litige': zZoneRange.optional().nullable(),
  motivations: z.array(zZoneRange).optional(),
  dispositif: zZoneRange.optional().nullable(),
  'moyens annexes': z.array(zZoneRange).optional()
})
export type ZoningZone = z.infer<typeof zZoningZones>

export const zIntroductionSubzonageJurinet = z.object({
  n_arret: z.string().optional().nullable(),
  formation: z.string().optional().nullable(),
  publication: z.array(z.string()).optional().nullable(),
  juridiction: z.string().optional().nullable(),
  chambre: z.string().optional().nullable(),
  pourvoi: z.array(z.string()).optional().nullable(),
  composition: zZoneRange.optional().nullable()
})
export type IntroductionSubzonageJurinet = z.infer<typeof zIntroductionSubzonageJurinet>

export const zIntroductionSubzonageJurica = z.object({
  type_arret: z.string().optional().nullable(),
  code_nac: z.string().optional().nullable(),
  nportalis: z.string().optional().nullable(),
  j_preced: zZoneRange.optional().nullable(),
  j_preced_date: z.string().optional().nullable(),
  j_preced_nrg: z.string().optional().nullable(),
  j_preced_npourvoi: z.string().optional().nullable(),
  j_preced_instance: z.string().optional().nullable(),
  composition: zZoneRange.optional().nullable()
})
export type IntroductionSubzonageJurica = z.infer<typeof zIntroductionSubzonageJurica>

export const zCurrentZoning = z.object({
  zones: zZoningZones.optional(),
  introduction_subzonage: zIntroductionSubzonageJurinet.or(zIntroductionSubzonageJurica).optional(),
  visa: z.array(z.string()).optional().nullable(),
  is_public: z.number().optional().nullable(),
  is_public_text: z.array(z.string()).optional().nullable(),
  arret_id: z.number()
})
export type CurrentZoning = z.infer<typeof zCurrentZoning>

export const zZoning = zCurrentZoning.or(record(z.string(), z.unknown()))
export type Zoning = z.infer<typeof zZoning>

export function isCurrentZoning(x: Zoning): x is CurrentZoning {
  return zCurrentZoning.safeParse(x).success
}

export function parseCurrentZoning(x: unknown): CurrentZoning {
  return zCurrentZoning.parse(x)
}

export function parseLabelStatus(x: unknown): LabelStatus {
  return zLabelStatus.parse(x)
}

export function parseLabelTreatments(x: unknown): LabelTreatments {
  return zLabelTreatments.parse(x)
}

export function parsePublishStatus(x: unknown): PublishStatus {
  return zPublishStatus.parse(x)
}
