import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListUserOrdersQuery } from './list-user-orders.query'
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../../domain/ports/order.repository.port'
import type { OrderHistoryPage } from '../../views/order-history.view'

@QueryHandler(ListUserOrdersQuery)
export class ListUserOrdersHandler implements IQueryHandler<ListUserOrdersQuery, OrderHistoryPage> {
  constructor(@Inject(ORDER_REPOSITORY) private readonly orders: IOrderRepository) {}

  async execute(query: ListUserOrdersQuery): Promise<OrderHistoryPage> {
    const { page, limit, sort, order, status } = query.filters
    return this.orders.listByBuyer({
      buyerId: query.buyerId,
      page,
      limit,
      sort,
      order,
      status,
    })
  }
}
