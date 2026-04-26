import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { CommonModule } from '../../common/common.module'
import { CartModule } from '../cart/cart.module'
import { InventoryModule } from '../inventory/inventory.module'
import { CreateOrderHandler } from './application/commands/create-order/create-order.handler'
import { TransitionOrderStatusHandler } from './application/commands/transition-order-status/transition-order-status.handler'
import { TransitionSubOrderStatusHandler } from './application/commands/transition-sub-order-status/transition-sub-order-status.handler'
import { GetAdminOrderHandler } from './application/queries/get-admin-order/get-admin-order.handler'
import { ListAdminOrdersHandler } from './application/queries/list-admin-orders/list-admin-orders.handler'
import { ListUserOrdersHandler } from './application/queries/list-user-orders/list-user-orders.handler'
import { ORDER_REPOSITORY } from './domain/ports/order.repository.port'
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order.repository'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

const CommandHandlers = [
  CreateOrderHandler,
  TransitionOrderStatusHandler,
  TransitionSubOrderStatusHandler,
]
const QueryHandlers = [ListUserOrdersHandler, ListAdminOrdersHandler, GetAdminOrderHandler]

@Module({
  imports: [CqrsModule, CommonModule, CartModule, InventoryModule],
  controllers: [OrderController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    OrderService,
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
  ],
  exports: [OrderService, ...CommandHandlers, ...QueryHandlers, ORDER_REPOSITORY],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class OrderModule {}
