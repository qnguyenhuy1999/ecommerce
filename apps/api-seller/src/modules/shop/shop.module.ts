import { Module } from '@nestjs/common'
import { ShopController } from './shop.controller'
import { ShopService } from './shop.service'
import { ShopRepository } from './repositories/shop.repository'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [ShopController],
  providers: [ShopService, ShopRepository],
  exports: [ShopService],
})
export class ShopModule {}
