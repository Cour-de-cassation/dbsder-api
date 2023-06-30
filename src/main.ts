import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as basicAuth from 'express-basic-auth'
import { CustomLogger } from './infrastructure/utils/customLogger.utils'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { convictConfig } from './convictConfig'

async function bootstrap() {
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

  // SETUP env to JSON file for Convict
  convictConfig.loadFile('convict-json-env.json')

  convictConfig.validate({ allowed: 'strict' })

  // that finalizes the launch of the app
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
