import { Injectable } from '@nestjs/common'

import type { OrderStatusView } from './application/views/order-summary.view'
import { InvalidOrderStatusTransitionException } from './domain/exceptions/order.exceptions'

const ALLOWED_TRANSITIONS: Record<OrderStatusView, OrderStatusView[]> = {
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['PROCESSING', 'REFUNDED', 'PENDING_REFUND'],
  PROCESSING: ['SHIPPED', 'REFUNDED', 'PENDING_REFUND'],
  SHIPPED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  REFUNDED: [],
  PENDING_REFUND: ['REFUNDED'],
}

@Injectable()
export class OrderService {
  assertCanTransition(current: OrderStatusView, next: OrderStatusView): void {
    if (!ALLOWED_TRANSITIONS[current].includes(next)) {
      throw new InvalidOrderStatusTransitionException(current, next)
    }
  }

  canTransition(current: OrderStatusView, next: OrderStatusView): boolean {
    return ALLOWED_TRANSITIONS[current].includes(next)
  }
}
