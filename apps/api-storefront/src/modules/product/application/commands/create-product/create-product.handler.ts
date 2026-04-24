import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'

import { CreateProductCommand } from './create-product.command'
import type { ProductEntity, ProductStatus } from '../../../domain/entities/product.entity'
import {
  CategoryNotFoundException,
  KycNotApprovedException,
  SellerNotFoundException,
  SkuExistsException,
} from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'
import { ISellerLookup, SELLER_LOOKUP } from '../../../domain/ports/seller-lookup.port'
import { CreateProductStatus } from '../../dtos/create-product.dto'

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand, ProductEntity> {
  private readonly logger = new Logger(CreateProductHandler.name)

  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository,
    @Inject(SELLER_LOOKUP) private readonly sellers: ISellerLookup,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    const seller = await this.sellers.findByUserId(command.userId)
    if (!seller) throw new SellerNotFoundException()
    if (!seller.isKycApproved()) throw new KycNotApprovedException()

    const { dto } = command

    const existing = await this.products.findBySellerAndSku(seller.id, dto.sku)
    if (existing) throw new SkuExistsException(dto.sku)

    this.assertUniqueVariantSkus(dto.variants ?? [])

    const status: ProductStatus =
      dto.status === CreateProductStatus.ACTIVE ? 'ACTIVE' : 'DRAFT'

    const variants =
      dto.variants && dto.variants.length > 0
        ? dto.variants.map((variant) => ({
            sku: variant.sku,
            attributes: variant.attributes,
            priceOverride: variant.priceOverride,
            stock: variant.stock,
          }))
        : [{ sku: dto.sku, attributes: {}, stock: 0 }]

    try {
      const product = await this.products.create({
        sellerId: seller.id,
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        status,
        categoryId: dto.categoryId,
        images: dto.images ?? [],
        variants,
      })
      this.logger.log(`Seller ${seller.id} created product ${product.id}`)
      return product
    } catch (error) {
      throw this.mapPrismaError(error, dto.sku)
    }
  }

  private assertUniqueVariantSkus(variants: ReadonlyArray<{ sku: string }>): void {
    const seen = new Set<string>()
    for (const variant of variants) {
      if (seen.has(variant.sku)) throw new SkuExistsException(variant.sku)
      seen.add(variant.sku)
    }
  }

  private mapPrismaError(error: unknown, sku: string): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return new SkuExistsException(sku)
      if (error.code === 'P2003') return new CategoryNotFoundException()
    }
    return error instanceof Error ? error : new Error('Unknown error')
  }
}
