import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as basicAuth from 'express-basic-auth'
import { CustomLogger } from './infrastructure/utils/customLogger.utils'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { convictConfiguration } from './convictConfig'
import { join } from 'path'
import * as dotenv from 'dotenv'

async function bootstrap() {
  const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'local'
  const envPath = join(__dirname, '..', `.env.${env}`.toLowerCase())
  dotenv.config({ path: envPath })
  const applicationConfiguration = convictConfiguration()
  const configInstance = applicationConfiguration.get()
  applicationConfiguration.validate()

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn']
  })

  // setup v1
  app.setGlobalPrefix('v1')

  // setup custom logs
  const customLogger = new CustomLogger()
  app.useLogger(customLogger)

  // setup Swagger

  // Add login/password to access to API Documentation
  const basicAuthOptions: basicAuth.IUsersOptions = {
    challenge: true,
    users: {}
  }
  basicAuthOptions.users[process.env.DOC_LOGIN] = process.env.DOC_PASSWORD
  app.use(['/doc', '/doc-json'], basicAuth(basicAuthOptions))

  // Add API Documentation with Swagger
  const config = new DocumentBuilder()
    .setTitle('DBSder API')
    .setDescription(
      'Documentation de DBSder API qui permet de fournir une interface aux appels de la DBSder'
    )
    .setVersion('1.0')
    .addTag('DbSder')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  // that finalizes the launch of the app
  await app.listen(process.env.PORT || 3000)
  return configInstance
}
const configInstance = bootstrap()

export default configInstance
