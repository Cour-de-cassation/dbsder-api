import { ConfigModule } from '@nestjs/config'
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AuthModule } from './infrastructure/auth/auth.module'
import { AuthMiddleware } from './infrastructure/middleware/auth/auth.middleware'
import { DecisionsController } from './infrastructure/controllers/decisions.controller'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [DecisionsController],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
