import { Module } from '@nestjs/common'
import { RedirectController } from './app.controller'

@Module({
  imports: [],
  controllers: [RedirectController],
  providers: []
})
export class AppModule {}
