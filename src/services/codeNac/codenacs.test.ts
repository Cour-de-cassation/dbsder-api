import { ObjectId } from 'mongodb'
import { CodeNac as CodeNacPayload } from '@dbsder-api-types'
import { ExistingCodeNac, NotFound } from '../error'
import { Filter } from 'mongodb'
import {
  findValidCodeNAC,
  findEveryByNAC,
  findEveryValidCodeNAC,
  findCodeNac,
  createNAC,
  updateNacById,
  deleteCodeNAC,
  findEveryNACBySubChapter
} from '../../connectors/sderDB'
import {
  fetchCodeNacByNac,
  fetchEveryCodeNacByNac,
  fetchEveryValidCodeNac,
  createCodeNac,
  updateNacIfExistsOrCreate,
  deleteCodeNac,
  fetchEverySubChapter
} from './handler'
import { IdParse } from '../../utils/serializeId'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.mock('../../connectors/sderDB', () => ({
  findValidCodeNAC: jest.fn(),
  findEveryByNAC: jest.fn(),
  findEveryValidCodeNAC: jest.fn(),
  findCodeNac: jest.fn(),
  createNAC: jest.fn(),
  updateNacById: jest.fn(),
  deleteCodeNAC: jest.fn(),
  findEveryNACBySubChapter: jest.fn()
}))

const mockFindValidCodeNAC = findValidCodeNAC as jest.MockedFunction<typeof findValidCodeNAC>
const mockFindEveryByNAC = findEveryByNAC as jest.MockedFunction<typeof findEveryByNAC>
const mockFindEveryValidCodeNAC = findEveryValidCodeNAC as jest.MockedFunction<
  typeof findEveryValidCodeNAC
>
const mockFindCodeNac = findCodeNac as jest.MockedFunction<typeof findCodeNac>
const mockCreateNAC = createNAC as jest.MockedFunction<typeof createNAC>
const mockUpdateNacById = updateNacById as jest.MockedFunction<typeof updateNacById>
const mockDeleteCodeNAC = deleteCodeNAC as jest.MockedFunction<typeof deleteCodeNAC>
const mockFindEveryNACBySubChapter = findEveryNACBySubChapter as jest.MockedFunction<
  typeof findEveryNACBySubChapter
>
export type CodeNac = IdParse<CodeNacPayload, '_id'>

const mockCodeNacAAA: CodeNac = {
  _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e1'),
  codeNAC: 'AAA',
  libelleNAC: 'Code NAC AAA',
  sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
  chapitre: { code: 'A', libelle: 'Chapitre A' },
  dateDebutValidite: new Date('2020-01-01'),
  dateFinValidite: null,
  codeUsageNonConseille: false,
  blocOccultation: 2,
  routeRelecture: null,
  categoriesToOmit: null,
  decisionsPubliques: null,
  debatsPublics: null
}

const mockCodeNacAA2: CodeNac = {
  _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e2'),
  codeNAC: 'AA2',
  libelleNAC: 'Code NAC AA2',
  sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
  chapitre: { code: 'A', libelle: 'Chapitre A' },
  dateDebutValidite: new Date('2020-01-01'),
  dateFinValidite: null,
  codeUsageNonConseille: false,
  blocOccultation: 1,
  routeRelecture: null,
  categoriesToOmit: null,
  decisionsPubliques: null,
  debatsPublics: null
}

const mockCodeNacAA5: CodeNac = {
  _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e3'),
  codeNAC: 'AA5',
  libelleNAC: 'Code NAC AA5',
  sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
  chapitre: { code: 'A', libelle: 'Chapitre A' },
  dateDebutValidite: new Date('2020-01-01'),
  dateFinValidite: null,
  codeUsageNonConseille: false,
  blocOccultation: 1,
  routeRelecture: null,
  categoriesToOmit: null,
  decisionsPubliques: null,
  debatsPublics: null
}

const mockCodeNacAAC: CodeNac = {
  _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e4'),
  codeNAC: 'AAC',
  libelleNAC: 'Code NAC AAC (invalide)',
  sousChapitre: { code: 'AA', libelle: 'Sous-chapitre AA' },
  chapitre: { code: 'A', libelle: 'Chapitre A' },
  dateDebutValidite: new Date('2020-01-01'),
  dateFinValidite: new Date('2021-12-31'),
  codeUsageNonConseille: true,
  blocOccultation: null,
  routeRelecture: null,
  categoriesToOmit: null,
  decisionsPubliques: null,
  debatsPublics: null
}

const mockCodeNacBB1: CodeNac = {
  _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e5'),
  codeNAC: 'BB1',
  libelleNAC: 'Code NAC BB1',
  sousChapitre: { code: 'BB', libelle: 'Sous-chapitre BB' },
  chapitre: { code: 'B', libelle: 'Chapitre B' },
  dateDebutValidite: new Date('2021-01-01'),
  dateFinValidite: null,
  codeUsageNonConseille: false,
  blocOccultation: 3,
  routeRelecture: null,
  categoriesToOmit: null,
  decisionsPubliques: null,
  debatsPublics: null
}

const mockCodeNacBB2: CodeNac = {
  _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e6'),
  codeNAC: 'BB2',
  libelleNAC: 'Code NAC BB2',
  sousChapitre: { code: 'BB', libelle: 'Sous-chapitre BB' },
  chapitre: { code: 'B', libelle: 'Chapitre B' },
  dateDebutValidite: new Date('2021-06-01'),
  dateFinValidite: null,
  codeUsageNonConseille: true,
  blocOccultation: 1,
  routeRelecture: null,
  categoriesToOmit: null,
  decisionsPubliques: null,
  debatsPublics: null
}

// Groupes de données
const allValidCodeNacs: CodeNac[] = [
  mockCodeNacAAA,
  mockCodeNacAA2,
  mockCodeNacAA5,
  mockCodeNacBB1,
  mockCodeNacBB2
]
const subChapterAACodeNacs: CodeNac[] = [mockCodeNacAAA, mockCodeNacAA2, mockCodeNacAA5]
const subChapterBBCodeNacs: CodeNac[] = [mockCodeNacBB1, mockCodeNacBB2]
const versionsAAA: CodeNac[] = [
  mockCodeNacAAA,
  {
    ...mockCodeNacAAA,
    _id: new ObjectId('65a1b2c3d4e5f6a7b8c9d0e7'),
    dateFinValidite: new Date('2022-12-31')
  }
]

beforeEach(() => {
  jest.clearAllMocks()
})

// ─────────────────────────────────────────────
// fetchCodeNacByNac
// ─────────────────────────────────────────────

describe('fetchCodeNacByNac', () => {
  it('devrait retourner le codenac AAA', async () => {
    mockFindValidCodeNAC.mockResolvedValue(mockCodeNacAAA)
    const result = await fetchCodeNacByNac('AAA')

    expect(findValidCodeNAC).toHaveBeenCalledWith('AAA')
    expect(result).toEqual(mockCodeNacAAA)
  })

  it('devrait retourner le codenac BB1', async () => {
    mockFindValidCodeNAC.mockResolvedValue(mockCodeNacBB1)
    const result = await fetchCodeNacByNac('BB1')

    expect(findValidCodeNAC).toHaveBeenCalledWith('BB1')
    expect(result).toEqual(mockCodeNacBB1)
  })

  it('devrait lever NotFound si le codenac est introuvable', async () => {
    mockFindValidCodeNAC.mockResolvedValue(null)

    await expect(fetchCodeNacByNac('ZZ2')).rejects.toThrow(NotFound)
    await expect(fetchCodeNacByNac('ZZ2')).rejects.toThrow(
      "Le codenac ZZ2 n'existe pas ou n'est pas en cours de validité."
    )
  })

  it('devrait lever NotFound pour un codenac expiré (AAC)', async () => {
    mockFindValidCodeNAC.mockResolvedValue(null)
    await expect(fetchCodeNacByNac('AAC')).rejects.toThrow(NotFound)
  })
})

// ─────────────────────────────────────────────
// fetchEveryCodeNacByNac
// ─────────────────────────────────────────────
describe('fetchEveryCodeNacByNac', () => {
  it('devrait retourner toutes les versions du codenac AAA', async () => {
    mockFindEveryByNAC.mockResolvedValue(versionsAAA)
    const result = await fetchEveryCodeNacByNac('AAA')

    expect(findEveryByNAC).toHaveBeenCalledWith('AAA')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual(mockCodeNacAAA)
  })

  it('devrait retourner la version unique du codenac BB1', async () => {
    mockFindEveryByNAC.mockResolvedValue([mockCodeNacBB1])
    const result = await fetchEveryCodeNacByNac('BB1')

    expect(result).toHaveLength(1)
    expect(result[0]?.codeNAC).toBe('BB1')
  })

  it('devrait retourner le codenac AAC meme not valid', async () => {
    mockFindEveryByNAC.mockResolvedValue([mockCodeNacAAC])
    const result = await fetchEveryCodeNacByNac('AAC')

    expect(result).toHaveLength(1)
    expect(result[0]?.codeNAC).toBe('AAC')
  })

  it('devrait lever NotFound si aucune version trouvée', async () => {
    mockFindEveryByNAC.mockResolvedValue([])
    await expect(fetchEveryCodeNacByNac('ZZZ')).rejects.toThrow(NotFound)
  })
})

// ─────────────────────────────────────────────
// fetchEveryValidCodeNac
// ─────────────────────────────────────────────
describe('fetchEveryValidCodeNac', () => {
  it('devrait retourner tous les codenacs valides sans filtre', async () => {
    mockFindEveryValidCodeNAC.mockResolvedValue(allValidCodeNacs)

    const filter: Filter<CodeNac> = {}
    const result = await fetchEveryValidCodeNac(filter)

    expect(findEveryValidCodeNAC).toHaveBeenCalledWith(filter)
    expect(result).toHaveLength(5)
    expect(result).toEqual(expect.arrayContaining(allValidCodeNacs))
  })

  it('devrait retourner les codenacs filtrés par sous-chapitre AA', async () => {
    mockFindEveryValidCodeNAC.mockResolvedValue(subChapterAACodeNacs)

    const filter: Filter<CodeNac> = { 'sousChapitre.code': 'AA' }
    const result = await fetchEveryValidCodeNac(filter)

    expect(findEveryValidCodeNAC).toHaveBeenCalledWith(filter)
    expect(result).toHaveLength(3)
    expect(result.every((c) => c.sousChapitre.code === 'AA')).toBe(true)
  })

  it('devrait lever NotFound si aucun codenac valide', async () => {
    mockFindEveryValidCodeNAC.mockResolvedValue([])

    await expect(fetchEveryValidCodeNac({})).rejects.toThrow(NotFound)
  })
})

// ─────────────────────────────────────────────
// createCodeNac
// ─────────────────────────────────────────────
describe('createCodeNac', () => {
  it('devrait créer un nouveau codenac AA3 si inexistant', async () => {
    mockFindCodeNac.mockResolvedValue(null)
    mockCreateNAC.mockResolvedValue({ ...mockCodeNacAAA, codeNAC: 'AA3' })
    const result = await createCodeNac({ codeNAC: 'AA3' })

    expect(findCodeNac).toHaveBeenCalledWith({ codeNAC: 'AA3', dateFinValidite: null })
    expect(createNAC).toHaveBeenCalledWith({ codeNAC: 'AA3' })
    expect(result).toEqual(expect.objectContaining({ codeNAC: 'AA3' }))
  })

  it('devrait créer un nouveau codenac BB3 si inexistant', async () => {
    mockFindCodeNac.mockResolvedValue(null)
    mockCreateNAC.mockResolvedValue({ ...mockCodeNacBB1, codeNAC: 'BB3' })

    const result = await createCodeNac({ codeNAC: 'BB3' })

    expect(createNAC).toHaveBeenCalledWith({ codeNAC: 'BB3' })
    expect(result).toEqual(expect.objectContaining({ codeNAC: 'BB3' }))
  })

  it('devrait lever ExistingCodeNac si AAA existe déjà', async () => {
    mockFindCodeNac.mockResolvedValue(mockCodeNacAAA)

    await expect(createCodeNac({ codeNAC: 'AAA' })).rejects.toThrow(ExistingCodeNac)
    expect(createNAC).not.toHaveBeenCalled()
  })
})

// ─────────────────────────────────────────────
// updateNacIfExistsOrCreate
// ─────────────────────────────────────────────
describe('updateNacIfExistsOrCreate', () => {
  it('devrait mettre à jour AAA (rendre obsolete) et créer une nouvelle version', async () => {
    mockFindCodeNac.mockResolvedValue(mockCodeNacAAA)
    mockUpdateNacById.mockResolvedValue({ ...mockCodeNacAAA, dateFinValidite: new Date() })
    mockCreateNAC.mockResolvedValue({ ...mockCodeNacAAA, libelleNAC: 'Nouvelle version AAA' })

    const updated = { ...mockCodeNacAAA, libelleNAC: 'Nouvelle version AAA' }
    const result = await updateNacIfExistsOrCreate(updated, 'AAA')

    expect(findCodeNac).toHaveBeenCalledWith({ codeNAC: 'AAA', dateFinValidite: null })
    expect(updateNacById).toHaveBeenCalledWith(
      mockCodeNacAAA._id,
      expect.objectContaining({
        codeUsageNonConseille: true,
        dateFinValidite: expect.any(Date)
      })
    )
    expect(createNAC).toHaveBeenCalledWith(updated)
    expect(result).toEqual(expect.objectContaining({ libelleNAC: 'Nouvelle version AAA' }))
  })

  it('devrait mettre à jour BB1 (rendre obsolete) et créer une nouvelle version', async () => {
    mockFindCodeNac.mockResolvedValue(mockCodeNacBB1)
    mockUpdateNacById.mockResolvedValue({ ...mockCodeNacBB1, dateFinValidite: new Date() })
    mockCreateNAC.mockResolvedValue({ ...mockCodeNacBB1, libelleNAC: 'Nouvelle version BB1' })

    const updated = { ...mockCodeNacBB1, libelleNAC: 'Nouvelle version BB1' }
    const result = await updateNacIfExistsOrCreate(updated, 'BB1')

    expect(findCodeNac).toHaveBeenCalledWith({ codeNAC: 'BB1', dateFinValidite: null })
    expect(updateNacById).toHaveBeenCalledWith(
      mockCodeNacBB1._id,
      expect.objectContaining({
        codeUsageNonConseille: true,
        dateFinValidite: expect.any(Date)
      })
    )
    expect(result).toEqual(expect.objectContaining({ libelleNAC: 'Nouvelle version BB1' }))
  })

  it("devrait lever NotFound si le codenac ZZZ n'existe pas", async () => {
    mockFindCodeNac.mockResolvedValue(null)

    await expect(updateNacIfExistsOrCreate(mockCodeNacAAA, 'ZZZ')).rejects.toThrow(NotFound)
    expect(updateNacById).not.toHaveBeenCalled()
    expect(createNAC).not.toHaveBeenCalled()
  })
})

// ─────────────────────────────────────────────
// deleteCodeNac
// ─────────────────────────────────────────────
describe('deleteCodeNac', () => {
  it('devrait supprimer AAA et retourner un message de confirmation', async () => {
    mockDeleteCodeNAC.mockResolvedValue(mockCodeNacAAA)
    const result = await deleteCodeNac('AAA')

    expect(deleteCodeNAC).toHaveBeenCalledWith('AAA')
    expect(result).toBe('Le codenac AAA a été supprimé')
  })

  it('devrait supprimer BB2 et retourner un message de confirmation', async () => {
    mockDeleteCodeNAC.mockResolvedValue(mockCodeNacBB2)
    const result = await deleteCodeNac('BB2')

    expect(deleteCodeNAC).toHaveBeenCalledWith('BB2')
    expect(result).toBe('Le codenac BB2 a été supprimé')
  })
})

// ─────────────────────────────────────────────
// fetchEverySubChapter
// ─────────────────────────────────────────────
describe('fetchEverySubChapter', () => {
  it('devrait retourner tous les codenacs du sous-chapitre AA', async () => {
    mockFindEveryNACBySubChapter.mockResolvedValue(subChapterAACodeNacs)

    const result = await fetchEverySubChapter('AA')

    expect(findEveryNACBySubChapter).toHaveBeenCalledWith('AA')
    expect(result).toHaveLength(3)
    expect(result.every((c) => c.sousChapitre.code === 'AA')).toBe(true)
  })

  it('devrait retourner tous les codenacs du sous-chapitre BB', async () => {
    mockFindEveryNACBySubChapter.mockResolvedValue(subChapterBBCodeNacs)

    const result = await fetchEverySubChapter('BB')

    expect(findEveryNACBySubChapter).toHaveBeenCalledWith('BB')
    expect(result).toHaveLength(2)
    expect(result.every((c) => c.sousChapitre.code === 'BB')).toBe(true)
  })

  it('devrait retourner un tableau vide si sous-chapitre inexistant', async () => {
    mockFindEveryNACBySubChapter.mockResolvedValue([])

    const result = await fetchEverySubChapter('ZZ')

    expect(result).toHaveLength(0)
  })
})
