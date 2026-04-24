import type { ListProductsDto } from '../../dtos/list-products.dto'

export class ListProductsQuery {
  constructor(readonly filters: ListProductsDto) {}
}
