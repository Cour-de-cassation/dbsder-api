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

export const convictConfiguration = () =>
  convict({
    labelApiKey: {
      env: 'LABEL_API_KEY',
      doc: 'Label API Key',
      format: 'uuid-api-key',
      default: '',
      sensitive: true
    },
    normalizationApiKey: {
      env: 'NORMALIZATION_API_KEY',
      doc: 'Normalization API Key',
      format: 'uuid-api-key',
      default: '',
      sensitive: true
    },
    opensderApiKey: {
      env: 'OPENSDER_API_KEY',
      doc: 'OpenSDER API Key',
      format: 'uuid-api-key',
      default: '',
      sensitive: true
    },
    docLogin: {
      env: 'DOC_LOGIN',
      doc: 'Login for Swagger documentation',
      format: String,
      default: ''
    },
    docPassword: {
      env: 'DOC_PASSWORD',
      doc: 'Password for Swagger documentation',
      format: String,
      default: ''
    },
    mongoDbUrl: {
      env: 'MONGO_DB_URL',
      doc: 'Mongo DB Url',
      format: String,
      default: ''
    }
  })
