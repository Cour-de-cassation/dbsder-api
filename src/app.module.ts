import { MiddlewareConsumer, Module } from '@nestjs/common'
import { DecisionsController } from './infrastructure/controllers/decisions.controller'
import { AuthModule } from './auth/auth.module'
import { AuthMiddleware } from './infrastructure/middleware/auth/auth.middleware'

@Module({
  imports: [AuthModule],
  controllers: [DecisionsController],
  providers: []
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
