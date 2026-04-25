import { Inject, Logger } from '@nestjs/common'
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
    const found = await this.cartRepo.findItemWithCart(command.cartItemId)
    if (!found) throw new CartItemNotFoundException()
    if (!found.cart.isOwnedBy(command.userId)) throw new NotCartOwnerException()

    await this.cartRepo.deleteItem(command.cartItemId)
    await this.cartCache.delete(command.userId)
    this.logger.log(`Cart item removed: item=${command.cartItemId}`)
  }
}
