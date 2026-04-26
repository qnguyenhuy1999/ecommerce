import type { ListUserOrdersDto } from '../../dtos/list-user-orders.dto'

export class ListUserOrdersQuery {
  constructor(
    readonly buyerId: string,
    readonly filters: ListUserOrdersDto,
  ) {}
}
