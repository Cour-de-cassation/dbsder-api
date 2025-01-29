import { GetDecisionsListResponse } from '../controllers/responses/getDecisionsList.response'
import { CodeDecision } from '../db/models/codeDecision.model'
import { CodeNAC } from '../db/models/codeNAC.model'
import { CreateDecisionDTO } from '../dto/createDecision.dto'
import { LabelTreatmentDto } from '../dto/updateDecision.dto'
import {
  LabelStatus,
  Occultation,
  PublishStatus,
  QualitePartie,
  Sources,
  TypePartie
} from 'dbsder-api-types'
import { Types } from 'mongoose'
import { DateType } from './dateType.utils'

const TODAY = new Date().toISOString()
const YESTERDAY_YYYY_MM_DD = new Date(new Date().setDate(new Date().getDate() - 1))
  .toISOString()
  .split('T')[0]
const TOMORROW_YYYY_MM_DD = new Date(new Date().setDate(new Date().getDate() + 1))
  .toISOString()
  .split('T')[0]

export class MockUtils {
  decisionTJToBeTreated: GetDecisionsListResponse = {
    dateCreation: TODAY,
    _id: '507f1f77bcf86cd799439011',
    sourceName: Sources.TJ,
    status: LabelStatus.TOBETREATED
  }

  decisionQueryDTO = {
    status: LabelStatus.TOBETREATED,
    sourceName: Sources.TJ,
    sourceId: 1,
    jurisdition: 'someJurisdictionName',
    chamber: 'someChamberName',
    dateDecision: YESTERDAY_YYYY_MM_DD,
    startDate: YESTERDAY_YYYY_MM_DD,
    endDate: TOMORROW_YYYY_MM_DD
  }
  decisionQueryByNumberDTO = {
    numero: '01/12345'
  }

  decisionQueryWithUnknownSourceDTO = {
    status: LabelStatus.TOBETREATED,
    sourceName: 'unknownSource',
    startDate: YESTERDAY_YYYY_MM_DD,
    endDate: TOMORROW_YYYY_MM_DD
  }

  decisionQueryWithUnknownNumberDTO = {
    number: 'unknownNumber'
  }

  validId = '507f1f77bcf86cd799439011'

  createDecisionDTO: CreateDecisionDTO = {
    analysis: {
      analyse: ['someAnalyse'],
      doctrine: 'someDoctrine',
      link: 'someLink',
      reference: ['someReference'],
      source: 'someSource',
      summary: 'someSummary',
      target: 'someTarget',
      title: ['someTitle']
    },
    appeals: ['someAppeal'],
    chamberId: 'someChamberId',
    chamberName: 'someChamberName',
    dateCreation: TODAY,
    dateDecision: YESTERDAY_YYYY_MM_DD,
    decatt: [1, 2],
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: LabelStatus.TOBETREATED,
    publishStatus: PublishStatus.TOBEPUBLISHED,
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit'],
      motivationOccultation: false
    },
    originalText: 'someOriginalText',
    parties: [
      {
        type: TypePartie.PP,
        nom: 'nom',
        prenom: 'prenom',
        civilite: 'M.',
        qualite: QualitePartie.I
      },
      {
        type: TypePartie.PP,
        nom: 'nom',
        prenom: 'prenom',
        civilite: 'Mme.',
        qualite: QualitePartie.K
      }
    ],
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: Sources.TJ,
    publication: ['somePublication'],
    formation: 'someFormation',
    blocOccultation: 1,
    NAOCode: 'someNAOCode',
    natureAffaireCivil: 'someNatureAffaireCivil',
    natureAffairePenal: 'someNatureAffairePenal',
    codeMatiereCivil: 'someCodeMatiereCivil'
  }

  zoningModel = {
    zones: null,
    introduction_subzonage: null,
    visa: [],
    is_public: 1,
    is_public_text: [],
    arret_id: 0
  }

  decisionModel = {
    NACCode: '45C',
    endCaseCode: '',
    codeNature: '',
    codeService: '',
    debatPublic: false,
    decisionAssociee: undefined,
    libelleEndCaseCode: '',
    libelleNAC: '',
    libelleNatureParticuliere: '',
    libelleService: '',
    matiereDeterminee: false,
    numeroRoleGeneral: '01/12345',
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    recommandationOccultation: undefined,
    selection: false,
    NAOCode: 'someNAOCode',
    analysis: {
      analyse: ['someAnalyse'],
      doctrine: 'someDoctrine',
      link: 'someLink',
      reference: ['someReference'],
      source: 'someSource',
      summary: 'someSummary',
      target: 'someTarget',
      title: ['someTitle']
    },
    appeals: ['someAppeal'],
    blocOccultation: 1,
    chamberId: 'someChamberId',
    chamberName: 'someChamberName',
    codeMatiereCivil: 'someCodeMatiereCivil',
    dateCreation: TODAY,
    dateDecision: YESTERDAY_YYYY_MM_DD,
    decatt: [1, 2],
    formation: 'someFormation',
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: LabelStatus.TOBETREATED,
    publishStatus: PublishStatus.TOBEPUBLISHED,
    natureAffaireCivil: 'someNatureAffaireCivil',
    natureAffairePenal: 'someNatureAffairePenal',
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit'],
      motivationOccultation: false
    },
    originalText: 'someOriginalText',
    parties: [{}],
    publication: ['somePublication'],
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: Sources.TJ,
    originalTextZoning: this.zoningModel,
    pseudoText: 'My decision pseudo text',
    firstImportDate: TODAY,
    lastImportDate: TODAY,
    publishDate: null,
    unpublishDate: null
  }

  labelTreatment: LabelTreatmentDto = {
    annotations: [
      {
        category: 'some-category',
        entityId: 'some-entity-id',
        start: 1,
        text: 'some-text',
        certaintyScore: 1
      },
      {
        category: 'other-category',
        entityId: 'other-entity-id',
        start: 5,
        text: 'other-text',
        certaintyScore: 0.5
      }
    ],
    source: 'some-source',
    order: 1,
    version: {
      juriSpacyTokenizer: { date: '2000-06-18', version: '1.2.3' },
      juritools: { date: '2000-06-18', version: '1.2.3' },
      pseudonymisationApi: { date: '2000-06-18', version: '1.2.3' },
      model: { name: 'MyModel' }
    },
    treatmentDate: '123456',
    checklist: [
      {
        check_type: 'juridoute',
        message: "L'annotation 'Fabien' est-elle une personne physique ?",
        short_message: 'Fabien [personnePhysique] ?',
        entities: [
          {
            category: 'personnePhysique',
            entityId: 'personnePhysique_fabien',
            start: 2732,
            end: 2746,
            text: 'Fabien',
            source: '',
            score: 0.5
          }
        ],
        sentences: [
          {
            start: 2700,
            end: 2747
          }
        ],
        metadata_text: []
      }
    ]
  }

  decisionPseudonymisee = {
    NACCode: '45C',
    endCaseCode: '',
    codeNature: '',
    codeService: '',
    debatPublic: false,
    decisionAssociee: undefined,
    libelleEndCaseCode: '',
    libelleNAC: '',
    libelleNatureParticuliere: '',
    libelleService: '',
    matiereDeterminee: false,
    numeroRoleGeneral: '01/12345',
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    recommandationOccultation: undefined,
    selection: false,
    NAOCode: 'someNAOCode',
    analysis: {
      analyse: ['someAnalyse'],
      doctrine: 'someDoctrine',
      link: 'someLink',
      reference: ['someReference'],
      source: 'someSource',
      summary: 'someSummary',
      target: 'someTarget',
      title: ['someTitle']
    },
    appeals: ['someAppeal'],
    blocOccultation: 1,
    chamberId: 'someChamberId',
    chamberName: 'someChamberName',
    codeMatiereCivil: 'someCodeMatiereCivil',
    dateCreation: TODAY,
    dateDecision: YESTERDAY_YYYY_MM_DD,
    decatt: [1, 2],
    formation: 'someFormation',
    _id: '507f1f77bcf86cd799439011',
    jurisdictionCode: 'someJurisdictionCode',
    jurisdictionId: 'someJurisdictionId',
    jurisdictionName: 'someJurisdictionName',
    labelStatus: LabelStatus.TOBETREATED,
    publishStatus: PublishStatus.TOBEPUBLISHED,
    natureAffaireCivil: 'someNatureAffaireCivil',
    natureAffairePenal: 'someNatureAffairePenal',
    occultation: {
      additionalTerms: 'someAdditionalTerms',
      categoriesToOmit: ['someCategoriesToOmit'],
      motivationOccultation: false
    },
    publication: ['somePublication'],
    registerNumber: 'someRegisterNumber',
    solution: 'someSolution',
    sourceId: 1,
    sourceName: Sources.TJ,
    originalTextZoning: this.zoningModel,
    pseudoText: 'My decision pseudo text',
    firstImportDate: TODAY,
    lastImportDate: TODAY,
    publishDate: null,
    unpublishDate: null
  }

  createDecisionTJDto = {
    ...this.createDecisionDTO,
    endCaseCode: '0aA',
    codeNature: '6C',
    codeService: '0A',
    debatPublic: true,
    indicateurQPC: true,
    libelleNAC: 'Demande en dommages-intérêts contre un organisme',
    libelleService: 'Libelle de service',
    libelleEndCaseCode: 'some libelle code decision / endCaseCode',
    libelleNatureParticuliere: 'Autres demandes en matière de frais et dépens',
    matiereDeterminee: true,
    numeroRoleGeneral: '01/12345',
    recommandationOccultation: Occultation.AUCUNE,
    pourvoiCourDeCassation: false,
    pourvoiLocal: false,
    selection: false,
    idDecisionTJ: 'TJ00001A01-1234520221121'
  }

  decisionAssociee = {
    numeroRegistre: 'A',
    numeroRoleGeneral: '01/12345',
    idJuridiction: 'TJ00000',
    date: '20221121'
  }

  presidentDtoMock = {
    fonction: 'president',
    nom: 'Nom Presidente',
    prenom: 'Prenom Presidente',
    civilite: 'Mme.'
  }

  createDecisionResponse = {
    _id: '507f1f77bcf86cd799439011',
    message: 'Decision créée ou mise à jour'
  }

  codeNACMock: CodeNAC = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
    codeNAC: '45C',
    libelleNAC: 'Modification Indemnités',
    blocOccultationCA: 3,
    blocOccultationTJ: 3,
    indicateurDecisionRenduePubliquement: null,
    indicateurDebatsPublics: null,
    indicateurAffaireSignalee: false,
    routeRelecture: null,
    categoriesToOmitTJ: {
      aucune: ['adresse', 'personne', 'etablissement', 'telephone'],
      conforme: ['professionnelAvocat', 'professionnelMagistratGreffier', 'personneMorale'],
      substituant: [
        'adresse',
        'localite',
        'numeroSiretSiren',
        'siteWeb',
        'etablissement',
        'telephoneFax'
      ],
      complément: ['avocat', 'greffier', 'personneMorale']
    },
    categoriesToOmitCA: {
      aucune: [
        'adresse',
        'cadastre',
        'personne',
        'professionnelAvocat',
        'professionnelMagistratGreffier',
        'dateNaissance',
        'dateDeces',
        'dateMariage',
        'numeroIdentifiant',
        'localite'
      ],
      conforme: ['avocat', 'greffier', 'personneMorale'],
      substituant: [
        'adresse',
        'cadastre',
        'personne',
        'professionnelAvocat',
        'professionnelMagistratGreffier',
        'dateNaissance',
        'dateDeces',
        'dateMariage',
        'numeroIdentifiant',
        'localite'
      ],
      complément: ['avocat', 'greffier', 'personneMorale']
    },
    niveau1NAC: {
      code: '1',
      libelle: 'Niveau 1'
    },
    niveau2NAC: {
      code: '13',
      libelle: 'Niveau 13'
    },
    isInJuricaDatabase: true
  }

  codeDecisionMock: CodeDecision = {
    _id: new Types.ObjectId('507f1f77bcf86cd799439099'),
    codeDecision: '6D',
    libelleCodeDecision: 'Libelle du code decision.',
    categorieCodeDecision: {
      code: '4',
      libelle: 'Libelle categorie code decision'
    },
    routeCA: 'Automatic',
    routeTJ: 'Exhaustive',
    overwritesNAC: false
  }

  dateTypeMock = {
    dateType: DateType.DATEDECISION
  }
}
