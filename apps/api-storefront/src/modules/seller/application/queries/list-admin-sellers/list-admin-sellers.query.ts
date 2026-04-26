import type { ListAdminSellersDto } from '../../dtos/list-admin-sellers.dto'

export class ListAdminSellersQuery {
  constructor(readonly filters: ListAdminSellersDto) {}
}
