import * as convict from 'convict'

export const convict_config = convict({
  docLoginSwagger: {
    doc: 'Login for Swagger documentation',
    format: String,
    default: '',
    env: process.env.DOC_LOGIN
  },
  docPasswordSwagger: {
    doc: 'Password for Swagger documentation',
    format: String,
    default: '',
    env: process.env.DOC_PASSWORD
  },
  labelApiKey: {
    doc: 'Label API Key',
    format: String,
    default: '',
    env: process.env.LABEL_API_KEY
  },
  normalizationApiKey: {
    doc: 'Normalization API Key',
    format: String,
    default: '',
    env: process.env.NORMALIZATION_API_KEY
  },
  openSderApiKey: {
    doc: 'Open SDER API Key',
    format: String,
    default: '',
    env: process.env.OPENSDER_API_KEY
  },
  mongoDBUrl: {
    doc: 'Mongo DB Url',
    format: String,
    default: '',
    env: process.env.MONGO_DB_URL
  }
})
