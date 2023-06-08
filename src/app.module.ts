import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { RedirectController } from './app.controller'
import { AuthModule } from './infrastructure/auth/auth.module'
import { DecisionSchema } from './infrastructure/db/models/decision.model'
import { AuthMiddleware } from './infrastructure/middleware/auth/auth.middleware'
import { DecisionsController } from './infrastructure/controllers/decisions.controller'
import { MongoRepository } from './infrastructure/db/repositories/mongo.repository'

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    MongooseModule.forFeature([{ name: 'DecisionModel', schema: DecisionSchema }])
  ],
  controllers: [RedirectController, DecisionsController],
  providers: [MongoRepository]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
