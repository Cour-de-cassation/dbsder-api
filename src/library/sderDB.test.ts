import { expect, jest } from '@jest/globals'
import { Filter, WithId } from 'mongodb'

import { Decision } from 'dbsder-api-types'

import * as sderDb from './sderDB'

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

describe('service/decision/rulesLabel', () => {
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
