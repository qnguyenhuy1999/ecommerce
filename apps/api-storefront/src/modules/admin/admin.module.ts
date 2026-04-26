import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { AdminSellerController } from './presentation/admin-seller.controller'
import { SellerModule } from '../seller/seller.module'

@Module({
  imports: [CqrsModule, AuthModule, SellerModule],
  controllers: [AdminSellerController],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class AdminModule {}
