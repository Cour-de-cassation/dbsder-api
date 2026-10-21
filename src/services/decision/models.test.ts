import { Origin } from '@dbsder-api-types'

import { NotSupported } from '../error'
import { parseDecisionListFilters } from './models'

describe('parseDecisionListFilters', () => {
  it('parses a valid sourceName into the corresponding Origin', () => {
    const filters = parseDecisionListFilters({ sourceName: 'jurinet' })

    expect(filters.sourceName).toBe(Origin.JURINET)
  })

  it('throws a NotSupported error when sourceName is invalid', () => {
    expect(() => parseDecisionListFilters({ sourceName: 'invalidSource' })).toThrow(NotSupported)
  })

  it('does not set sourceName when it is absent', () => {
    const filters = parseDecisionListFilters({})

    expect(filters.sourceName).toBeUndefined()
  })
})
