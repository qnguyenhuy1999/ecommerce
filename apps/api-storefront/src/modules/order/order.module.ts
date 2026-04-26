import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CartModule } from '../cart/cart.module'
import { InventoryModule } from '../inventory/inventory.module'
import { CreateOrderHandler } from './application/commands/create-order/create-order.handler'
import { ListUserOrdersHandler } from './application/queries/list-user-orders/list-user-orders.handler'
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port'
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order.repository'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [CqrsModule, CartModule, InventoryModule],
  controllers: [OrderController],
  providers: [
    CreateOrderHandler,
    ListUserOrdersHandler,
    OrderService,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
  ],
  exports: [OrderService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class OrderModule {}
