import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetAdminOrderQuery } from './get-admin-order.query'
import { OrderNotFoundException } from '../../../domain/exceptions/order.exceptions'
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../../domain/ports/order.repository.port'
import type { AdminOrderDetailView } from '../../views/admin-order.view'

@QueryHandler(GetAdminOrderQuery)
export class GetAdminOrderHandler
  implements IQueryHandler<GetAdminOrderQuery, AdminOrderDetailView>
{
  constructor(@Inject(ORDER_REPOSITORY) private readonly orders: IOrderRepository) {}

  async execute(query: GetAdminOrderQuery): Promise<AdminOrderDetailView> {
    const detail = await this.orders.findByIdForAdmin(query.orderId)
    if (!detail) throw new OrderNotFoundException(query.orderId)
    return detail
  }
}
