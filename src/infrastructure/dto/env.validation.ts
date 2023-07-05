import * as Joi from 'joi'

export const envValidationConfig = {
  cache: true,
  validationSchema: Joi.object({
    LABEL_API_KEY: Joi.string().guid({
      version: ['uuidv4'],
      separator: true
    }),
    NORMALIZATION_API_KEY: Joi.string().guid({
      version: ['uuidv4'],
      separator: true
    }),
    OPENSDER_API_KEY: Joi.string().guid({
      version: ['uuidv4'],
      separator: true
    }),
    DOC_LOGIN: Joi.string().required(),
    DOC_PASSWORD: Joi.string().required(),
    MONGO_DB_URL: Joi.string().required()
  })
}
