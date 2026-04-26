import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateOrderCommand } from './create-order.command'
import { CART_CACHE, ICartCache } from '../../../../cart/domain/ports/cart-cache.port'
import { IOrderRepository, ORDER_REPOSITORY } from '../../../domain/ports/order.repository.port'
import type { OrderSummaryView } from '../../views/order-summary.view'

const RESERVATION_TTL_MINUTES = 30

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, OrderSummaryView> {
  private readonly logger = new Logger(CreateOrderHandler.name)

  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: IOrderRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderSummaryView> {
    const reservationExpiresAt = new Date(Date.now() + RESERVATION_TTL_MINUTES * 60_000)
    const order = await this.orderRepo.createFromCart({
      userId: command.userId,
      shippingAddress: command.shippingAddress,
      reservationExpiresAt,
    })

    await this.cartCache.delete(command.userId)
    this.logger.log(`Order created from cart: user=${command.userId} order=${order.orderId}`)
    return order
  }
}
