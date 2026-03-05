import {
  ATTACHMENTS_API_KEY,
  INDEX_API_KEY,
  LABEL_API_KEY,
  ODDJ_DASHBOARD_API_KEY,
  NORMALIZATION_API_KEY,
  OPENSDER_API_KEY,
  OPS_API_KEY,
  PUBLICATION_API_KEY
} from '../library/env'
import { UnauthorizedError } from '../library/error'

// Warn: I don't understand some of this services
export enum Service {
  INDEX = 'index',
  LABEL = 'label',
  ODDJ_DASHBOARD_API_KEY = 'juripilot',
  NORMALIZATION = 'normalization',
  OPS = 'ops',
  PUBLICATION = 'publication',
  ATTACHEMENTS = 'attachements',
  OPENSDER = 'opensder'
}

export function apiKeyToService(apiKey: string): Service {
  switch (apiKey) {
    case INDEX_API_KEY:
      return Service.INDEX
    case LABEL_API_KEY:
      return Service.LABEL
    case ODDJ_DASHBOARD_API_KEY:
      return Service.ODDJ_DASHBOARD_API_KEY
    case NORMALIZATION_API_KEY:
      return Service.NORMALIZATION
    case OPS_API_KEY:
      return Service.OPS
    case OPENSDER_API_KEY:
      return Service.OPENSDER
    case PUBLICATION_API_KEY:
      return Service.PUBLICATION
    case ATTACHMENTS_API_KEY:
      return Service.ATTACHEMENTS
    default:
      throw new UnauthorizedError()
  }
}
