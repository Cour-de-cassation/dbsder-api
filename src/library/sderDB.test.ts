import { expect, jest } from '@jest/globals'
import { Filter, MongoClient, WithId, WithoutId } from 'mongodb'

import { CodeNac, Decision } from 'dbsder-api-types'

import * as sderDb from './sderDB'
import request from 'supertest'

const decisions = [
  { _id: 1 },
  { _id: 2 },
  { _id: 3 },
  { _id: 4 },
  { _id: 5 },
  { _id: 6 },
  { _id: 7 }
] as unknown[] as WithId<Decision>[] // we should never do this trick, just for test

const findDecisions = jest.spyOn(sderDb, 'findDecisions')

describe('service/decision', () => {
  beforeEach(() => {
    findDecisions.mockReset()
  })

  describe('findDecisionsWithPagination', () => {
    it('should return without cursor if all results are there', async () => {
      const mocked = findDecisions
        .mockResolvedValueOnce({ decisions, length: decisions.length })
        .mockResolvedValueOnce({ decisions: [], length: decisions.length })
        .mockResolvedValueOnce({
          decisions: [],
          length: decisions.length
        }) as unknown as typeof sderDb.findDecisions

      const result = await sderDb.findDecisionsWithPagination({}, {}, mocked)

      expect(result).toStrictEqual({
        decisions,
        totalDecisions: decisions.length,
        previousCursor: undefined,
        nextCursor: undefined
      })
    })

    it('should return with cursors if there are', async () => {
      const previousDecision = decisions.slice(1, 2)
      const decisionsInPage = decisions.slice(2, 6)
      const nextDecision = decisions.slice(6, 7)

      const mocked = findDecisions
        .mockResolvedValueOnce({ decisions: decisionsInPage, length: decisions.length })
        .mockResolvedValueOnce({ decisions: previousDecision, length: decisions.length })
        .mockResolvedValueOnce({
          decisions: nextDecision,
          length: decisions.length
        }) as unknown as typeof sderDb.findDecisions

      const result = await sderDb.findDecisionsWithPagination({}, {}, mocked)

      expect(result).toStrictEqual({
        decisions: decisionsInPage,
        totalDecisions: decisions.length,
        previousCursor: previousDecision[0]?._id,
        nextCursor: nextDecision[0]?._id
      })
    })

    it('should call findDecisions without pageFilters if no pages', async () => {
      const mocked = findDecisions.mockResolvedValue({
        decisions: [],
        length: decisions.length
      }) as unknown as typeof sderDb.findDecisions
      const pages = {}
      const filters: Filter<Decision> = { sourceName: 'juritj' }

      await sderDb.findDecisionsWithPagination(filters, pages, mocked)

      expect(findDecisions.mock.calls[0]).toStrictEqual([filters, pages])
    })

    it('should call findDecisions with pageFilters to searchBefore', async () => {
      const mocked = findDecisions.mockResolvedValue({
        decisions: [],
        length: decisions.length
      }) as unknown as typeof sderDb.findDecisions
      const pages = { searchBefore: 1 }
      const filters: Filter<Decision> = { sourceName: 'juritj' }

      await sderDb.findDecisionsWithPagination(filters, pages, mocked)

      expect(findDecisions.mock.calls[0]).toStrictEqual([
        filters,
        { _id: { $gte: pages.searchBefore } }
      ])
    })

    it('should call findDecisions with pageFilters to searchAfter', async () => {
      const mocked = findDecisions.mockResolvedValue({
        decisions: [],
        length: decisions.length
      }) as unknown as typeof sderDb.findDecisions
      const pages = { searchAfter: 5 }
      const filters: Filter<Decision> = { sourceName: 'juritj' }

      await sderDb.findDecisionsWithPagination(filters, pages, mocked)

      expect(findDecisions.mock.calls[0]).toStrictEqual([
        filters,
        { _id: { $lte: pages.searchAfter } }
      ])
    })
  })

  afterAll(() => {
    findDecisions.mockRestore()
  })
})

// code nac test part version 2

// Données de test
const testData = {
  AAA: {
    codeNAC: 'AAA',
    libelleNAC: 'Code NAC AAA',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRElecture: 'exhaustif',
    blocOccultation: 2,
    categoriesToOccult: ['personnePhysique', 'adresse'],
    decisionsPubliques: 'decisions publiques',
    debatsPublics: 'débats publics',
    obsolete: false
  },
  AA1: {
    codeNAC: 'AA1',
    libelleNAC: 'Code NAC AA1',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: null,
    routeRElecture: 'simple',
    blocOccultation: 1,
    categoriesToOccult: null,
    decisionsPubliques: 'decisions non publiques',
    debatsPublics: null,
    obsolete: false
  },
  AAC: {
    codeNAC: 'AAC',
    libelleNAC: 'Code NAC AAC (invalide)',
    sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
    chapitre: { code: 'A', libelle: 'Chapitre A' },
    dateDebutValidite: new Date('2020-01-01'),
    dateFinValidite: new Date('2021-12-31'),
    routeRElecture: null,
    blocOccultation: null,
    categoriesToOccult: null,
    decisionsPubliques: null,
    debatsPublics: null,
    obsolete: false
  }
}

let db: MongoClient;
beforeAll(async () => {
  const uri = 'mongodb://localhost:55433/docker-local'
  db = new MongoClient(uri)
  await db.connect()
})

afterAll(async () => {
  await db.close()
})

beforeEach(async () => {
  const database = db.db()
  await database.collection('codenacs').deleteMany({})
  await database.collection('codenacs').insertMany([
    testData.AAA,
    testData.AA1,
    testData.AAC
  ])
})

describe('GET /codenacs - Récupération de tous les codenac valides', () => {

  it('devrait retourner tous les codenac valides avec status 200', async () => {
    const response = await request(`localhost:3008`).get('/codenacs')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ codeNAC: 'AAA', dateFinValidite: null }),
        expect.objectContaining({ codeNAC: 'AA1', dateFinValidite: null })
      ])
    )
  })

})

describe('Get /codenacs/:AAA - Récuperation du codenac AAA', () => {
  it('devrait retourner le codenac AAA valide avec status 200', async () => {
    const response = await request(`localhost:3008`).get('/codenacs/AAA')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('codeNAC', 'AAA')
    expect(response.body).toEqual(
      expect.objectContaining({ codeNAC: 'AAA', dateFinValidite: null, obsolete: false })
    )
  })
})


describe(`Get /codenacs/:AAB - Récuperation d'un codenac qui n'exsite pas `, () => {
  it(` devrait retourner un message de notFound`, async () => {
    const response = await request(`localhost:3008`).get('/codenacs/AAB')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({ "error": { "type": "notFound", "variableName": "Le codenac AAB n'existe pas ou n'est pas en cours de validité." } })
    )
  })
})

describe(`Get /codenacs/:AAC - Récuperation d'un codenac invalide`, () => {
  it(`devrait retourner un message de notFound`, async () => {
    const response = await request(`localhost:3008`).get('/codenacs/AAC')
    expect(response.status).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({ "error": { "type": "notFound", "variableName": "Le codenac AAC n'existe pas ou n'est pas en cours de validité." } })
    )
  })
})

// à revoir les critère de verification de la validité du codenac créé
describe(`Post /codenacs - Création d'un codenac`, () => {
  it(`devrait créer un codenac et le retourner avec un status 201`, async () => {
    const newCodeNac = {
      codeNAC: 'AA2',
      libelleNAC: 'Code NAC AA2',
      sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
      chapitre: { code: 'A', libelle: 'Chapitre A' }
    }

    const response = await request(`localhost:3008`)
      .post('/codenacs')
      .send(newCodeNac)
      .set('Accept', 'application/json')
    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({ codeNAC: 'AA2' })
    )
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
    expect(response.status).toBe(409)
    expect(response.body).toEqual(
      expect.objectContaining({ "error": { "type": "existingCodeNac", "variableName": "Le codenac AAA existe déjà." } })
    )
  })
})


// test for creating an existing but invalid codenac à revoir sa necessité ?? on peut gérer l'affichage dans la class existingcodenac error pour retrouner ce que l'on veut comme massage
describe(`Post /codenacs - Création d'un codenac existant mais invalide`, () => {
  it(`devrait retourner une erreur indiquant que le codenac existe déjà et qu'il est obsolette`, async () => {
    const newCodeNac = {
      codeNAC: 'AAC',
      libelleNAC: 'Code NAC AAC',
      sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
      chapitre: { code: 'A', libelle: 'Chapitre A' }
    }

    const response = await request(`localhost:3008`)
      .post('/codenacs')
      .send(newCodeNac)
      .set('Accept', 'application/json')
    expect(response.status).toBe(409)
    expect(response.body).toEqual(
      expect.objectContaining({ "error": { "type": "existingCodeNac", "variableName": "Le codenac AAC existe déjà." } })
    )
  })
})
