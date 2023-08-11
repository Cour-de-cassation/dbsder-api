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
import { DecisionsRepository } from './infrastructure/db/repositories/decisions.repository'
import { envValidationConfig } from './infrastructure/dto/env.validation'
import { LoggerModule } from 'nestjs-pino'
import { pinoConfig } from './infrastructure/utils/pinoConfig.utils'

@Module({
  imports: [
    ConfigModule.forRoot(envValidationConfig),
    AuthModule,
    TerminusModule.forRoot({
      logger: false
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MongooseModule.forFeature([{ name: 'DecisionModel', schema: DecisionSchema }]),
    LoggerModule.forRoot(pinoConfig)
  ],
  controllers: [RedirectController, DecisionsController, HealthController],
  providers: [DecisionsRepository]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
