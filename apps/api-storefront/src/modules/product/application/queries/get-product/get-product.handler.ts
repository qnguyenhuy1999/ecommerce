import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetProductQuery } from './get-product.query'
import type { ProductEntity } from '../../../domain/entities/product.entity'
import { ProductNotFoundException } from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery, ProductEntity> {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository) {}

  async execute(query: GetProductQuery): Promise<ProductEntity> {
    const product = await this.products.findByIdWithDetails(query.productId, {
      excludeStatus: 'DELETED',
    })
    if (!product) throw new ProductNotFoundException(query.productId)
    return product
  }
}
