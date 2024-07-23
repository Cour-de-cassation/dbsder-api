import { LoggerModule } from 'nestjs-pino'
import { ConfigModule } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { MongooseModule } from '@nestjs/mongoose'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { RedirectController } from './app.controller'
import { AuthModule } from './infrastructure/auth/auth.module'
import { pinoConfig } from './infrastructure/utils/pinoConfig.utils'
import { envValidationConfig } from './infrastructure/dto/env.validation'
import { Decision, DecisionSchema } from './infrastructure/db/models/decision.model'
import { AuthMiddleware } from './infrastructure/middleware/auth/auth.middleware'
import { DecisionsRepository } from './infrastructure/db/repositories/decisions.repository'
import { HealthController } from './infrastructure/controllers/health/health.controller'
import { GetDecisionByIdController } from './infrastructure/controllers/getDecisionById.controller'
import { ListDecisionsController } from './infrastructure/controllers/getDecisionsList.controller'
import { CreateDecisionsController } from './infrastructure/controllers/createDecisions.controller'
import { UpdateDecisionStatutController } from './infrastructure/controllers/updateDecisionStatut.controller'
import { GetDecisionPseudonymiseesController } from './infrastructure/controllers/getDecisionPseudonymiseeById.controller'
import { UpdateDecisionPseudonymiseeController } from './infrastructure/controllers/updateDecisionPseudonymisee.controller'
import { UpdateDecisionRapportsOccultationsController } from './infrastructure/controllers/updateDecisionRapportsOccultations.controller'
import { DeleteDecisionByIdController } from './infrastructure/controllers/deleteDecisionById.controller'
import { CodeNAC, CodeNACSchema } from './infrastructure/db/models/codeNAC.model'
import { CodeNACsRepository } from './infrastructure/db/repositories/codeNACs.repository'
import { ZoningApiService } from './service/zoningApi.service'
import { CodeDecision, CodeDecisionSchema } from './infrastructure/db/models/codeDecision.model'
import { CodeDecisionRepository } from './infrastructure/db/repositories/codeDecision.repository'

@Module({
  imports: [
    ConfigModule.forRoot(envValidationConfig),
    AuthModule,
    TerminusModule.forRoot({
      logger: false
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MongooseModule.forFeature([
      { name: Decision.name, schema: DecisionSchema },
      { name: CodeNAC.name, schema: CodeNACSchema },
      { name: CodeDecision.name, schema: CodeDecisionSchema }
    ]),
    LoggerModule.forRoot(pinoConfig)
  ],
  controllers: [
    RedirectController,
    HealthController,
    GetDecisionByIdController,
    GetDecisionPseudonymiseesController,
    ListDecisionsController,
    CreateDecisionsController,
    UpdateDecisionPseudonymiseeController,
    UpdateDecisionRapportsOccultationsController,
    UpdateDecisionStatutController,
    DeleteDecisionByIdController
  ],
  providers: [DecisionsRepository, CodeNACsRepository, ZoningApiService, CodeDecisionRepository]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
