import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'

import { UpdateProductCommand } from './update-product.command'
import type { ProductEntity, ProductStatus } from '../../../domain/entities/product.entity'
import {
  CategoryNotFoundException,
  NotProductOwnerException,
  ProductNotFoundException,
  SkuExistsException,
} from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand, ProductEntity> {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<ProductEntity> {
    const product = await this.products.findForOwnerCheck(command.productId)
    if (!product || product.isDeleted()) {
      throw new ProductNotFoundException(command.productId)
    }
    if (!product.isOwnedBy(command.userId)) {
      throw new NotProductOwnerException()
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
