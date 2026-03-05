import dotenv from 'dotenv'
import { MissingValue } from './error'

if (!process.env.NODE_ENV) dotenv.config()

if (process.env.ATTACHMENTS_API_KEY == null)
  throw new MissingValue('process.env.ATTACHMENTS_API_KEY')
if (process.env.INDEX_API_KEY == null) throw new MissingValue('process.env.INDEX_API_KEY')
if (process.env.LABEL_API_KEY == null) throw new MissingValue('process.env.LABEL_API_KEY')
if (process.env.ODDJ_DASHBOARD_API_KEY == null)
  throw new MissingValue('process.env.ODDJ_DASHBOARD_API_KEY')
if (process.env.MONGO_DB_URL == null) throw new MissingValue('process.env.MONGO_DB_URL')
if (process.env.NODE_ENV == null) throw new MissingValue('process.env.NODE_ENV')
if (process.env.NORMALIZATION_API_KEY == null)
  throw new MissingValue('process.env.NORMALIZATION_API_KEY')
if (process.env.OPENSDER_API_KEY == null) throw new MissingValue('process.env.OPENSDER_API_KEY')
if (process.env.OPS_API_KEY == null) throw new MissingValue('process.env.OPS_API_KEY')
if (process.env.PUBLICATION_API_KEY == null)
  throw new MissingValue('process.env.PUBLICATION_API_KEY')

export const {
  ATTACHMENTS_API_KEY,
  INDEX_API_KEY,
  LABEL_API_KEY,
  ODDJ_DASHBOARD_API_KEY,
  MONGO_DB_URL,
  NODE_ENV,
  NORMALIZATION_API_KEY,
  OPENSDER_API_KEY,
  OPS_API_KEY,
  PORT = 3000,
  PUBLICATION_API_KEY
} = process.env
