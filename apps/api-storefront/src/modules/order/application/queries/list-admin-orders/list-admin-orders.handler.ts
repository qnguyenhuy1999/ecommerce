import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListAdminOrdersQuery } from './list-admin-orders.query'
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../../domain/ports/order.repository.port'
import type {
  AdminOrderListPage,
} from '../../views/admin-order.view'
import type { OrderStatusView } from '../../views/order-summary.view'

@QueryHandler(ListAdminOrdersQuery)
export class ListAdminOrdersHandler
  implements IQueryHandler<ListAdminOrdersQuery, AdminOrderListPage>
{
  constructor(@Inject(ORDER_REPOSITORY) private readonly orders: IOrderRepository) {}

  async execute(query: ListAdminOrdersQuery): Promise<AdminOrderListPage> {
    const { page, limit, status, sellerId, buyerEmail, placedFrom, placedTo } = query.filters
    return this.orders.listForAdmin({
      page,
      limit,
      status: status as OrderStatusView | undefined,
      sellerId,
      buyerEmail,
      placedFrom: placedFrom ? new Date(placedFrom) : undefined,
      placedTo: placedTo ? new Date(placedTo) : undefined,
    })
  }
}
