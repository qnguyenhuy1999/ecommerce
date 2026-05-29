import { Module } from '@nestjs/common'
import { DatabaseModule } from '@ecom/database'
import { HomepageController } from './homepage.controller'
import { HomepageService } from './homepage.service'

@Module({
  imports: [DatabaseModule],
  controllers: [HomepageController],
  providers: [HomepageService],
})
export class HomepageModule {}
