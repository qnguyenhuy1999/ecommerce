import type { ListAdminOrdersDto } from '../../dtos/list-admin-orders.dto'

export class ListAdminOrdersQuery {
  constructor(readonly filters: ListAdminOrdersDto) {}
}
