import { Inject, InternalServerErrorException, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UpdateCartItemCommand } from './update-cart-item.command'
import {
  CartItemNotFoundException,
  InsufficientStockException,
  InvalidQuantityException,
  NotCartOwnerException,
} from '../../../domain/exceptions/cart.exceptions'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'
import { CartViewService } from '../../services/cart-view.service'
import type { CartItemView } from '../../views/cart.view'

@CommandHandler(UpdateCartItemCommand)
export class UpdateCartItemHandler
  implements ICommandHandler<UpdateCartItemCommand, CartItemView>
{
  private readonly logger = new Logger(UpdateCartItemHandler.name)

  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
    private readonly cartViewService: CartViewService,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartItemView> {
    if (command.quantity < 1) throw new InvalidQuantityException()

    const found = await this.cartRepo.findItemWithCart(command.cartItemId)
    if (!found) throw new CartItemNotFoundException()
    if (!found.cart.isOwnedBy(command.userId)) throw new NotCartOwnerException()

    const variant = found.item.variant
    if (!variant) {
      // Defensive: repository is contractually required to hydrate the variant.
      throw new InternalServerErrorException({
        code: 'CART_ITEM_VARIANT_MISSING',
        message: 'Cart item was returned without its variant',
      })
    }
    if (!variant.canFulfillQuantity(command.quantity)) {
      throw new InsufficientStockException()
    }

    const persisted = await this.cartRepo.updateItemQuantity(command.cartItemId, command.quantity)

    // Rebuild the authoritative view from the full cart so the response (and
    // the next cache miss) reflect cross-item totals correctly.
    const cart =
      (await this.cartRepo.findByUserIdWithItems(command.userId)) ??
      (() => {
        throw new InternalServerErrorException({
          code: 'CART_NOT_FOUND_AFTER_UPDATE',
          message: 'Cart disappeared between ownership check and view build',
        })
      })()
    const view = this.cartViewService.toView(cart)
    await this.cartCache.delete(command.userId)

    const itemView = view.items.find((i) => i.id === persisted.id)
    if (!itemView) {
      // Unreachable: we just persisted this item into the cart we're rendering.
      throw new InternalServerErrorException({
        code: 'CART_VIEW_INCONSISTENT',
        message: 'Failed to locate just-updated cart item in the rendered view',
      })
    }

    this.logger.log(
      `Cart item quantity updated: item=${command.cartItemId} qty=${String(command.quantity)}`,
    )
    return itemView
  }
}
