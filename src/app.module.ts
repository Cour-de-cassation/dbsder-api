import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { MongooseModule } from '@nestjs/mongoose'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { RedirectController } from './app.controller'
import { AuthModule } from './infrastructure/auth/auth.module'
import { DecisionSchema } from './infrastructure/db/models/decision.model'
import { AuthMiddleware } from './infrastructure/middleware/auth/auth.middleware'
import { DecisionsController } from './infrastructure/controllers/decisions.controller'
import { HealthController } from './infrastructure/controllers/health/health.controller'
import { MongoRepository } from './infrastructure/db/repositories/mongo.repository'
import * as Joi from 'joi'

@Module({
  imports: [
    ConfigModule.forRoot({
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
    }),
    AuthModule,
    TerminusModule.forRoot({
      logger: false
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MongooseModule.forFeature([{ name: 'DecisionModel', schema: DecisionSchema }])
  ],
  controllers: [RedirectController, DecisionsController, HealthController],
  providers: [MongoRepository]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
