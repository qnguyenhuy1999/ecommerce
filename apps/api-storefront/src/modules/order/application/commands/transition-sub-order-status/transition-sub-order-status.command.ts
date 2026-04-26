import type { AdminOrderTransitionTarget } from '../../dtos/transition-order-status.dto'
import type { AdminOrderShippingTracking } from '../../views/admin-order.view'

export class TransitionSubOrderStatusCommand {
  constructor(
    readonly subOrderId: string,
    readonly toStatus: AdminOrderTransitionTarget,
    readonly adminUserId: string,
    readonly shippingTracking: AdminOrderShippingTracking | undefined,
  ) {}
}
