import { Inject, Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { ProductVariantEntity } from '../../domain/entities/product-variant.entity'
import type { IProductVariantRepository } from '../../domain/ports/product-variant.repository.port'

const VARIANT_INCLUDE = {
  product: {
    include: { seller: { select: { id: true, storeName: true } } },
  },
} satisfies Prisma.ProductVariantInclude

type VariantRow = Prisma.ProductVariantGetPayload<{ include: typeof VARIANT_INCLUDE }>

@Injectable()
export class PrismaProductVariantRepository implements IProductVariantRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ProductVariantEntity | null> {
    const record = await this.prisma.productVariant.findUnique({
      where: { id },
      include: VARIANT_INCLUDE,
    })
    return record ? this.toDomain(record) : null
  }

  private toDomain(record: VariantRow): ProductVariantEntity {
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
        status: record.product.status,
        seller: {
          id: record.product.seller.id,
          storeName: record.product.seller.storeName,
        },
      },
    })
  }
}
