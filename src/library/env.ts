import dotenv from 'dotenv'
import { missingValue } from './error'

if (!process.env.NODE_ENV) dotenv.config()

if (process.env.ATTACHMENTS_API_KEY == null)
  throw missingValue('process.env.ATTACHMENTS_API_KEY', new Error())
if (process.env.INDEX_API_KEY == null) throw missingValue('process.env.INDEX_API_KEY', new Error())
if (process.env.LABEL_API_KEY == null) throw missingValue('process.env.LABEL_API_KEY', new Error())
if (process.env.MONGO_DB_URL == null) throw missingValue('process.env.MONGO_DB_URL', new Error())
if (process.env.NODE_ENV == null) throw missingValue('process.env.NODE_ENV', new Error())
if (process.env.NORMALIZATION_API_KEY == null)
  throw missingValue('process.env.NORMALIZATION_API_KEY', new Error())
if (process.env.OPENSDER_API_KEY == null)
  throw missingValue('process.env.OPENSDER_API_KEY', new Error())
if (process.env.OPS_API_KEY == null) throw missingValue('process.env.OPS_API_KEY', new Error())
if (process.env.PUBLICATION_API_KEY == null)
  throw missingValue('process.env.PUBLICATION_API_KEY', new Error())
if (process.env.ZONING_API_URL == null)
  throw missingValue('process.env.ZONING_API_URL', new Error())

export const {
  ATTACHMENTS_API_KEY,
  INDEX_API_KEY,
  LABEL_API_KEY,
  MONGO_DB_URL,
  NODE_ENV,
  NORMALIZATION_API_KEY,
  OPENSDER_API_KEY,
  OPS_API_KEY,
  PORT = 3000,
  PUBLICATION_API_KEY,
  ZONING_API_URL
} = process.env
