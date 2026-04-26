import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { TransitionSubOrderStatusCommand } from './transition-sub-order-status.command'
import { ShippingTrackingRequiredException } from '../../../domain/exceptions/order.exceptions'
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../../domain/ports/order.repository.port'
import type { AdminOrderDetailView } from '../../views/admin-order.view'

@CommandHandler(TransitionSubOrderStatusCommand)
export class TransitionSubOrderStatusHandler
  implements ICommandHandler<TransitionSubOrderStatusCommand, AdminOrderDetailView>
{
  private readonly logger = new Logger(TransitionSubOrderStatusHandler.name)

  constructor(@Inject(ORDER_REPOSITORY) private readonly orders: IOrderRepository) {}

  async execute(command: TransitionSubOrderStatusCommand): Promise<AdminOrderDetailView> {
    if (command.toStatus === 'SHIPPED' && !command.shippingTracking) {
      throw new ShippingTrackingRequiredException()
    }

    const detail = await this.orders.transitionSubOrderStatus({
      subOrderId: command.subOrderId,
      toStatus: command.toStatus,
      adminUserId: command.adminUserId,
      shippingTracking: command.shippingTracking,
    })
    this.logger.log(
      `Admin ${command.adminUserId} transitioned sub-order ${command.subOrderId} → ${command.toStatus}`,
    )
    return detail
  }
}
