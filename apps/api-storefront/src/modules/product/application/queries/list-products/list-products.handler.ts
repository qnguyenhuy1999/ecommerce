import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListProductsQuery } from './list-products.query'
import type { ProductEntity } from '../../../domain/entities/product.entity'
import { InvalidPriceRangeException } from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'

export interface ListProductsResult {
  data: ProductEntity[]
  page: number
  limit: number
  total: number
  totalPages: number
}

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<ListProductsQuery, ListProductsResult> {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository) {}

  async execute(query: ListProductsQuery): Promise<ListProductsResult> {
    const { q, category, sellerId, minPrice, maxPrice, page, limit, sort, order } = query.filters

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new InvalidPriceRangeException()
    }

    const { data, total } = await this.products.list({
      q,
      categoryId: category,
      sellerId,
      minPrice,
      maxPrice,
      status: 'ACTIVE',
      page,
      limit,
      sort,
      order,
    })

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }
}
