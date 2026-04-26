import type { AdminOrderTransitionTarget } from '../../dtos/transition-order-status.dto'

export class TransitionOrderStatusCommand {
  constructor(
    readonly orderId: string,
    readonly toStatus: AdminOrderTransitionTarget,
    readonly adminUserId: string,
  ) {}
}
