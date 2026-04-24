import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { ListProductVariantsQuery } from './list-variants.query'
import type { ProductVariantSnapshot } from '../../../domain/entities/product.entity'
import { ProductNotFoundException } from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'

export interface VariantView extends ProductVariantSnapshot {
  availableStock: number
}

@QueryHandler(ListProductVariantsQuery)
export class ListProductVariantsHandler
  implements IQueryHandler<ListProductVariantsQuery, VariantView[]>
{
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository) {}

  async execute(query: ListProductVariantsQuery): Promise<VariantView[]> {
    const variants = await this.products.listVariants(query.productId, {
      excludeStatus: 'DELETED',
    })
    if (variants === null) throw new ProductNotFoundException(query.productId)

    return variants.map((v) => ({
      ...v,
      availableStock: Math.max(0, v.stock - v.reservedStock),
    }))
  }
}
