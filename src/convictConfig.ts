import * as convict from 'convict'
import { v4 as uuidv4 } from 'uuid'

// UUID check format
convict.addFormat({
  name: 'uuid-api-key',
  validate: (uuid: string) => {
    if (uuid && uuid.length > 0) {
      uuidv4()
    }
  }
})

export const convictConfig = convict({
  LABEL_API_KEY: {
    doc: 'Label API Key',
    format: 'uuid-api-key',
    default: '',
    sensitive: true,
    env: process.env.LABEL_API_KEY
  },
  NORMALIZATION_API_KEY: {
    doc: 'Normalization API Key',
    format: 'uuid-api-key',
    default: '',
    sensitive: true,
    env: process.env.NORMALIZATION_API_KEY
  },
  OPENSDER_API_KEY: {
    doc: 'Open SDER API Key',
    format: 'uuid-api-key',
    default: '',
    sensitive: true,
    env: process.env.OPENSDER_API_KEY
  },
  DOC_LOGIN: {
    doc: 'Login for Swagger documentation',
    format: String,
    default: '',
    env: process.env.DOC_LOGIN
  },
  DOC_PASSWORD: {
    doc: 'Password for Swagger documentation',
    format: String,
    default: '',
    env: process.env.DOC_PASSWORD
  },
  MONGO_DB_URL: {
    doc: 'Mongo DB Url',
    format: String,
    default: '',
    env: process.env.MONGO_DB_URL
  }
})
