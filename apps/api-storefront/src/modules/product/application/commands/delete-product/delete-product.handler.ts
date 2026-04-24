import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DeleteProductCommand } from './delete-product.command'
import {
  NotProductOwnerException,
  ProductNotFoundException,
} from '../../../domain/exceptions/product.exceptions'
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/ports/product.repository.port'

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand, void> {
  constructor(@Inject(PRODUCT_REPOSITORY) private readonly products: IProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const product = await this.products.findForOwnerCheck(command.productId)
    if (!product || product.isDeleted()) {
      throw new ProductNotFoundException(command.productId)
    }
    if (!product.isOwnedBy(command.userId)) {
      throw new NotProductOwnerException()
    }
    await this.products.softDelete(command.productId)
  }
}
