import { Module } from '@nestjs/common'
import { ShopPageController } from './shop-page.controller'
import { ShopPageService } from './shop-page.service'

@Module({
  controllers: [ShopPageController],
  providers: [ShopPageService],
})
export class ShopPageModule {}
