import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { AuthModule } from '@ecom/nest-auth'

import { NotificationModule } from '../notification/notification.module'
import { ApproveSellerHandler } from './application/commands/approve-seller/approve-seller.handler'
import { RegisterSellerHandler } from './application/commands/register-seller/register-seller.handler'
import { RejectSellerHandler } from './application/commands/reject-seller/reject-seller.handler'
import { UpdateSellerHandler } from './application/commands/update-seller/update-seller.handler'
import { GetSellerHandler } from './application/queries/get-seller/get-seller.handler'
import { SELLER_REPOSITORY } from './domain/ports/seller.repository.port'
import { PrismaSellerRepository } from './infrastructure/repositories/prisma-seller.repository'
import { SellerController } from './presentation/seller.controller'

const CommandHandlers = [
  RegisterSellerHandler,
  UpdateSellerHandler,
  ApproveSellerHandler,
  RejectSellerHandler,
]
const QueryHandlers = [GetSellerHandler]

@Module({
  imports: [CqrsModule, AuthModule, NotificationModule],
  controllers: [SellerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    { provide: SELLER_REPOSITORY, useClass: PrismaSellerRepository },
  ],
  exports: [SELLER_REPOSITORY, ...CommandHandlers, ...QueryHandlers],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS module class requires empty body
export class SellerModule {}
