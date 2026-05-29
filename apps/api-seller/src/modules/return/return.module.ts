import { Module } from '@nestjs/common'
import { ReturnController } from './return.controller'
import { ReturnService } from './return.service'
import { ReturnRepository } from './repositories/return.repository'
import { AuthModule } from '../auth/auth.module'
import { ShopModule } from '../shop/shop.module'

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [ReturnController],
  providers: [ReturnService, ReturnRepository],
  exports: [ReturnService],
})
export class ReturnModule {}
