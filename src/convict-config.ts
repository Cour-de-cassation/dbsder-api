import * as convict from 'convict'

export const convict_config = convict({
  LABEL_API_KEY: {
    doc: 'Label API Key',
    format: String,
    default: '',
    sensitive: true,
    env: process.env.LABEL_API_KEY
  },
  NORMALIZATION_API_KEY: {
    doc: 'Normalization API Key',
    format: String,
    default: '',
    sensitive: true,
    env: process.env.NORMALIZATION_API_KEY
  },
  OPENSDER_API_KEY: {
    doc: 'Open SDER API Key',
    format: String,
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
