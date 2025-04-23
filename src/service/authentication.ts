import { missingValue, unauthorizedError } from "../library/error";

if (process.env.INDEX_API_KEY == null)
  throw missingValue("process.env.INDEX_API_KEY", new Error());
if (process.env.LABEL_API_KEY == null)
  throw missingValue("process.env.LABEL_API_KEY", new Error());
if (process.env.NORMALIZATION_API_KEY == null)
  throw missingValue("process.env.NORMALIZATION_API_KEY", new Error());
if (process.env.OPENSDER_API_KEY == null)
  throw missingValue("process.env.OPENSDER_API_KEY", new Error());
if (process.env.OPS_API_KEY == null)
  throw missingValue("process.env.OPS_API_KEY", new Error());
if (process.env.PUBLICATION_API_KEY == null)
  throw missingValue("process.env.PUBLICATION_API_KEY", new Error());
if (process.env.ATTACHMENTS_API_KEY == null)
  throw missingValue("process.env.ATTACHMENTS_API_KEY", new Error());

const {
  INDEX_API_KEY,
  LABEL_API_KEY,
  NORMALIZATION_API_KEY,
  OPENSDER_API_KEY,
  OPS_API_KEY,
  PUBLICATION_API_KEY,
  ATTACHMENTS_API_KEY,
} = process.env;

// Warn: I don't understand some of this services
export enum Service {
  INDEX = "index",
  LABEL = "label",
  NORMALIZATION = "normalization",
  OPS = "ops",
  PUBLICATION = "publication",
  ATTACHEMENTS = "attachements",
  OPENSDER = "opensder",
}

export function apiKeyToService(apiKey: string): Service {
  switch (apiKey) {
    case INDEX_API_KEY:
      return Service.INDEX;
    case LABEL_API_KEY:
      return Service.LABEL;
    case NORMALIZATION_API_KEY:
      return Service.NORMALIZATION;
    case OPS_API_KEY:
      return Service.OPS;
    case OPENSDER_API_KEY:
      return Service.OPENSDER;
    case PUBLICATION_API_KEY:
      return Service.PUBLICATION;
    case ATTACHMENTS_API_KEY:
      return Service.ATTACHEMENTS;
    default:
      throw unauthorizedError(new Error());
  }
}
