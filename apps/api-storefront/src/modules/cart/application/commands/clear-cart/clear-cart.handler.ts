import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { ClearCartCommand } from './clear-cart.command'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'

@CommandHandler(ClearCartCommand)
export class ClearCartHandler implements ICommandHandler<ClearCartCommand, void> {
  private readonly logger = new Logger(ClearCartHandler.name)

  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
  ) {}

  async execute(command: ClearCartCommand): Promise<void> {
    const cart = await this.cartRepo.findByUserIdWithItems(command.userId)
    if (cart) {
      await this.cartRepo.deleteAllItems(cart.id)
    }
    await this.cartCache.delete(command.userId)
    this.logger.log(`Cart cleared: user=${command.userId}`)
  }
}
