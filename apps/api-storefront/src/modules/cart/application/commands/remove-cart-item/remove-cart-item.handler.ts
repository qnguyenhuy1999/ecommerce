import { ForbiddenException, Inject, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RemoveCartItemCommand } from './remove-cart-item.command'
import {
  CartItemNotFoundException,
  NotCartOwnerException,
} from '../../../domain/exceptions/cart.exceptions'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'

@CommandHandler(RemoveCartItemCommand)
export class RemoveCartItemHandler implements ICommandHandler<RemoveCartItemCommand, void> {
  private readonly logger = new Logger(RemoveCartItemHandler.name)

  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
  ) {}

  async execute(command: RemoveCartItemCommand): Promise<void> {
    const item = await this.cartRepo.findItemById(command.cartItemId)
    if (!item) {
      throw new NotFoundException({
        code: new CartItemNotFoundException().code,
        message: new CartItemNotFoundException().message,
      })
    }

    const cart = await this.cartRepo.findCartById(item.cartId)
    if (!cart || !cart.isOwnedBy(command.userId)) {
      throw new ForbiddenException({
        code: new NotCartOwnerException().code,
        message: new NotCartOwnerException().message,
      })
    }

    await this.cartRepo.deleteItem(command.cartItemId)
    await this.cartCache.delete(command.userId)
    this.logger.log(`Cart item removed: item=${command.cartItemId}`)
  }
}
