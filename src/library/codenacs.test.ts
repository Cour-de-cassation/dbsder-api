import { expect } from '@jest/globals'
import { MongoClient, WithoutId } from 'mongodb'

import { CodeNac } from 'dbsder-api-types'
import request from 'supertest'
import { LabelRoute } from 'dbsder-api-types/dist/typeGuards/common.zod'

// Données de test pour les codenacs
const testData: Record<string, Partial<WithoutId<CodeNac>>> = {
  AAA: {
    codeNAC: 'AAA',
    libelleNAC: 'Code NAC AAA',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRelecture: LabelRoute.PAS_DE_RELECTURE,
    blocOccultation: 2,
    categoriesToOccult: {
      nonSuivi: ['personnePhysique', 'adresse'],
      suivi: null
    },
    decisionsPubliques: 'décisions publiques',
    debatsPublics: 'débats publics',
    codeUsageNonConseille: false
  },
  AA8: {
    codeNAC: 'AA8',
    libelleNAC: 'Code NAC AA8',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRelecture: LabelRoute.PAS_DE_RELECTURE,
    blocOccultation: 2,
    categoriesToOccult: {
      nonSuivi: ['personnePhysique', 'adresse'],
      suivi: null
    },
    decisionsPubliques: 'décisions publiques',
    debatsPublics: 'débats publics',
    codeUsageNonConseille: false
  },
  AA1: {
    codeNAC: 'AA1',
    libelleNAC: 'Code NAC AA1',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRelecture: LabelRoute.DOUBLE_RELECTURE,
    blocOccultation: 1,
    categoriesToOccult: null,
    decisionsPubliques: 'décisions non publiques',
    debatsPublics: null,
    codeUsageNonConseille: false
  },
  AA5: {
    codeNAC: 'AA5',
    libelleNAC: 'Code NAC AA5',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRelecture: LabelRoute.DOUBLE_RELECTURE,
    blocOccultation: 1,
    categoriesToOccult: null,
    decisionsPubliques: 'décisions non publiques',
    debatsPublics: null,
    codeUsageNonConseille: false
  },
  AAC: {
    codeNAC: 'AAC',
    libelleNAC: 'Code NAC AAC (invalide)',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: new Date('2021-12-31'),
    routeRelecture: null,
    blocOccultation: null,
    decisionsPubliques: null,
    debatsPublics: null,
    codeUsageNonConseille: true
  },
  AA2: {
    codeNAC: 'AA2',
    libelleNAC: 'Code NAC AA2 (invalide)',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRelecture: LabelRoute.PAS_DE_RELECTURE,
    blocOccultation: 1,
    codeUsageNonConseille: false
  },
  AA4: {
    codeNAC: 'AA4',
    libelleNAC: 'Code NAC AA4',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRelecture: LabelRoute.PAS_DE_RELECTURE,
    blocOccultation: 1,
    codeUsageNonConseille: true
  }
}

let db: MongoClient
beforeAll(async () => {
  const uri = 'mongodb://localhost:55433/SDER'
  db = new MongoClient(uri)
  await db.connect()
})

afterAll(async () => {
  await db.close()
})

beforeEach(async () => {
  const database = db.db()
  await database.collection('codenacs').deleteMany({})
  await database
    .collection('codenacs')
    .insertMany([
      testData.AAA!,
      testData.AA1!,
      testData.AAC!,
      testData.AA2!,
      testData.AA4!,
      testData.AA5!,
      testData.AA8!
    ])
})

describe('GET /codenacs - Récupération de tous les codenac valides', () => {
  it('devrait retourner tous les codenac valides avec status 200', async () => {
    const response = await request(`localhost:3008`)
      .get('/codenacs')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(6)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ codeNAC: 'AAA' }),
        expect.objectContaining({ codeNAC: 'AA8' }),
        expect.objectContaining({ codeNAC: 'AA4' })
      ])
    )
  })
})

describe('GET /codenacs - Récupération de tous les codenac valides avec filtres', () => {
  it('devrait retourner tous les codenac valides avec status 200', async () => {
    const response = await request(`localhost:3008`)
      .get(`/codenacs?${{codeNAC: "AAA"}}`)
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(6)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ codeNAC: 'AAA' }),
      ])
    )
  })
})

describe('Get /codenacs/:AAA - Récuperation du codenac AAA', () => {
  it('devrait retourner le codenac AAA valide avec status 200', async () => {
    const response = await request(`localhost:3008`)
      .get('/codenacs/AAA')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('codeNAC', 'AAA')
    expect(response.body).toEqual(
      expect.objectContaining({
        codeNAC: 'AAA',
        dateFinValidite: null,
        codeUsageNonConseille: false
      })
    )
  })
})

describe(`Get /codenacs/:AAB - Récuperation d'un codenac qui n'exsite pas `, () => {
  it(` devrait retourner un message de notFound`, async () => {
    const response = await request(`localhost:3008`)
      .get('/codenacs/AAB')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          type: 'notFound',
          variableName: "Le codenac AAB n'existe pas ou n'est pas en cours de validité."
        }
      })
    )
  })
})

describe(`Get /codenacs/:AAC - Récuperation d'un codenac invalide`, () => {
  it(`devrait retourner un message de notFound`, async () => {
    const response = await request(`localhost:3008`)
      .get('/codenacs/AAC')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          type: 'notFound',
          variableName: "Le codenac AAC n'existe pas ou n'est pas en cours de validité."
        }
      })
    )
  })
})

describe(`Post /codenacs - Création d'un codenac`, () => {
  it(`devrait créer un codenac et le retourner avec un status 201`, async () => {
    const newCodeNac = {
      codeNAC: 'AA3',
      libelleNAC: 'Code NAC AA3',
      sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
      chapitre: { code: 'A', libelle: 'Chapitre A' }
    }

    const response = await request(`localhost:3008`)
      .post('/codenacs')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
      .send(newCodeNac)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({ codeNAC: 'AA3' }))
  })
})

describe(`Post /codenacs - Création d'un codenac existant`, () => {
  it(`devrait retourner une erreur indiquant que le codenac existe déjà`, async () => {
    const existingCodeNac = {
      codeNAC: 'AAA',
      libelleNAC: 'Code NAC AAA',
      sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
      chapitre: { code: 'A', libelle: 'Chapitre A' }
    }

    const response = await request(`localhost:3008`)
      .post('/codenacs')
      .send(existingCodeNac)
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(409)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          type: 'existingCodeNac',
          message: `Le codenac AAA existe déjà, dateFinValidite: , obsolete: false.`
        }
      })
    )
  })
})

describe('Put /codenacs/:AA6 - Modification codenac non existante', () => {
  it('devrait retourner une erreur de notFound', async () => {
    const updatedCodeNac = {
      codeNAC: 'AA6',
      libelleNAC: 'Code NAC AA6 modifié',
      sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
      chapitre: { code: 'A', libelle: 'Chapitre A' }
    }
    const response = await request(`localhost:3008`)
      .put('/codenacs/:AA6')
      .send(updatedCodeNac)
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: { type: 'notFound', variableName: "Le code NAC AA6 n'existe pas." }
      })
    )
  })
})

describe('Put /codenacs/:AA2 - Modification codenac existante et valid - création nouvelle version codenac ', () => {
  it('devrait créer une nouvelle version valide en mettant fin à la date de validité', async () => {
    const updatedCodeNac = {
      codeNAC: 'AA2',
      libelleNAC: 'Nouvelle version Code NAC AA2',
      dateDebutValidite: new Date('2020-01-01'),
      dateFinValidite: null
    }
    const response = await request(`localhost:3008`)
      .put('/codenacs/AA2')
      .send(updatedCodeNac)
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({ libelleNAC: 'Nouvelle version Code NAC AA2' })
    )
  })
})

describe(`Delete /codenacs/:AA0 - Suppression de codenac qui n'existe pas`, () => {
  it('devrait renvoyer un code not found 404', async () => {
    const response = await request(`localhost:3008`)
      .delete('/codenacs/AA0')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          type: 'notFound',
          variableName: "Le code NAC AA0 n'existe pas."
        }
      })
    )
  })
})

describe(`Delete /codenacs/:AA5 - Suppression de codenac qui existe et est valide`, () => {
  it('devrait renvoyer un code 200', async () => {
    const response = await request(`localhost:3008`)
      .delete('/codenacs/AA5')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(200)
  })
})

describe(`Get /codenacs/versions/AAA - Retourne tout les versions du codenac recherché`, () => {
  it('devrait renvoyer un code 200', async () => {
    const response = await request(`localhost:3008`)
      .get('/codenacs/versions/AAA')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(200)
  })
})

describe('GET /souschapitre/:sous-chapitre.code  - Retourne tout les code NAC par leur sous-chapitre', () => {
  it(`devrait retourner un tableau de nac si le sous-chapitre existe`, async () => {
    const response = await request(`localhost:3008`)
      .get('/souschapitre/:AA')
      .set('Accept', 'application/json')
      .set('x-api-key', '3d8767ff-ed2a-47bd-91c2-f5ebac712f2c')
    expect(response.status).toBe(200)
  })
})
