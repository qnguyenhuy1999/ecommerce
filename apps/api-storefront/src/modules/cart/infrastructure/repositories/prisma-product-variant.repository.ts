import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import {
  ProductVariantEntity,
  type ProductStatus,
} from '../../domain/entities/product-variant.entity'
import type { IProductVariantRepository } from '../../domain/ports/product-variant.repository.port'

@Injectable()
export class PrismaProductVariantRepository implements IProductVariantRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ProductVariantEntity | null> {
    const record = await this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          include: { seller: { select: { id: true, storeName: true } } },
        },
      },
    })
    if (!record) return null

    return new ProductVariantEntity({
      id: record.id,
      sku: record.sku,
      attributes: record.attributes,
      priceOverride: record.priceOverride,
      stock: record.stock,
      reservedStock: record.reservedStock,
      product: {
        id: record.product.id,
        name: record.product.name,
        price: record.product.price,
        status: record.product.status as ProductStatus,
        seller: {
          id: record.product.seller.id,
          storeName: record.product.seller.storeName,
        },
      },
    })
  }
}
