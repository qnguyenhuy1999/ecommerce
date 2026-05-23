import { Module } from '@nestjs/common'
import { CategoryPageController } from './category-page.controller'
import { CategoryPageService } from './category-page.service'

@Module({
  controllers: [CategoryPageController],
  providers: [CategoryPageService],
})
export class CategoryPageModule {}
