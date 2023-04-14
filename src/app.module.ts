import { Module } from '@nestjs/common'
import { DecisionsController } from './infrastructure/controllers/decisions.controller'

@Module({
  imports: [],
  controllers: [DecisionsController],
  providers: []
})
export class AppModule {}
