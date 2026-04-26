import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { AdminOrderController } from './presentation/admin-order.controller'
import { AdminSellerController } from './presentation/admin-seller.controller'
import { OrderModule } from '../order/order.module'
import { SellerModule } from '../seller/seller.module'

@Module({
  imports: [CqrsModule, AuthModule, SellerModule, OrderModule],
  controllers: [AdminSellerController, AdminOrderController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class AdminModule {}
