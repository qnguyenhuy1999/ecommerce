import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'

import { UpdateProductCommand } from './update-product.command'
import type { ProductEntity, ProductStatus } from '../../../domain/entities/product.entity'
import {
  CategoryNotFoundException,
  KycNotApprovedException,
  NotProductOwnerException,
  ProductNotFoundException,
  SellerNotFoundException,
  SkuExistsException,
} from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'
import { ISellerLookup, SELLER_LOOKUP } from '../../../domain/ports/seller-lookup.port'
import { UpdateProductStatus } from '../../dtos/update-product.dto'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand, ProductEntity> {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository,
    @Inject(SELLER_LOOKUP) private readonly sellers: ISellerLookup,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductEntity> {
    const product = await this.products.findForOwnerCheck(command.productId)
    if (!product || product.isDeleted()) {
      throw new ProductNotFoundException(command.productId)
    }
    if (!product.isOwnedBy(command.userId)) {
      throw new NotProductOwnerException()
    }

    // Gate publish (status -> ACTIVE) on approved KYC. Pending/rejected
    // sellers may still patch DRAFT products, but cannot push them live.
    if (command.dto.status === UpdateProductStatus.ACTIVE) {
      const seller = await this.sellers.findByUserId(command.userId)
      if (!seller) throw new SellerNotFoundException()
      if (!seller.isKycApproved()) throw new KycNotApprovedException()
    }

    try {
      return await this.products.update(command.productId, {
        sku: command.dto.sku,
        name: command.dto.name,
        description: command.dto.description,
        price: command.dto.price,
        status: command.dto.status as ProductStatus | undefined,
        categoryId: command.dto.categoryId,
        images: command.dto.images,
      })
    } catch (error) {
      throw this.mapPrismaError(error, command.dto.sku)
    }
  }

  private mapPrismaError(error: unknown, sku: string | undefined): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return new SkuExistsException(sku ?? '')
      if (error.code === 'P2003') return new CategoryNotFoundException()
    }
    return error instanceof Error ? error : new Error('Unknown error')
  }
}
