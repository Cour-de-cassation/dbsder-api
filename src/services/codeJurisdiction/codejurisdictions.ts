import { CodeJurisdiction as CodeJurisdictionPayload } from '@dbsder-api-types'
import { IdParse } from '../../utils/serializeId'

export type CodeJurisdiction = IdParse<CodeJurisdictionPayload, '_id'>