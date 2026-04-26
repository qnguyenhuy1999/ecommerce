import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { TransitionOrderStatusCommand } from './transition-order-status.command'
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../../domain/ports/order.repository.port'
import type { AdminOrderDetailView } from '../../views/admin-order.view'

@CommandHandler(TransitionOrderStatusCommand)
export class TransitionOrderStatusHandler
  implements ICommandHandler<TransitionOrderStatusCommand, AdminOrderDetailView>
{
  private readonly logger = new Logger(TransitionOrderStatusHandler.name)

  constructor(@Inject(ORDER_REPOSITORY) private readonly orders: IOrderRepository) {}

  async execute(command: TransitionOrderStatusCommand): Promise<AdminOrderDetailView> {
    const detail = await this.orders.transitionOrderStatus({
      orderId: command.orderId,
      toStatus: command.toStatus,
      adminUserId: command.adminUserId,
    })
    this.logger.log(
      `Admin ${command.adminUserId} transitioned order ${command.orderId} → ${command.toStatus}`,
    )
    return detail
  }
}
