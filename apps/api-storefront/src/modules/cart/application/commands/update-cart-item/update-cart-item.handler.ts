import {
  BadRequestException,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UpdateCartItemCommand } from './update-cart-item.command'
import {
  CartItemNotFoundException,
  InsufficientStockException,
  InvalidQuantityException,
  NotCartOwnerException,
  VariantNotFoundException,
} from '../../../domain/exceptions/cart.exceptions'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/ports/product-variant.repository.port'
import { CartViewService } from '../../services/cart-view.service'
import type { CartItemView } from '../../views/cart.view'

@CommandHandler(UpdateCartItemCommand)
export class UpdateCartItemHandler
  implements ICommandHandler<UpdateCartItemCommand, CartItemView>
{
  private readonly logger = new Logger(UpdateCartItemHandler.name)

  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(PRODUCT_VARIANT_REPOSITORY) private readonly variantRepo: IProductVariantRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
    private readonly cartViewService: CartViewService,
  ) {}

  async execute(command: UpdateCartItemCommand): Promise<CartItemView> {
    if (command.quantity < 1) {
      throw new BadRequestException({
        code: new InvalidQuantityException().code,
        message: new InvalidQuantityException().message,
      })
    }

    const item = await this.cartRepo.findItemById(command.cartItemId)
    if (!item) {
      throw new NotFoundException({
        code: new CartItemNotFoundException().code,
        message: new CartItemNotFoundException().message,
      })
    }

    const cart = await this.cartRepo.findByUserIdWithItems(command.userId)
    if (!cart || cart.id !== item.cartId || !cart.isOwnedBy(command.userId)) {
      throw new ForbiddenException({
        code: new NotCartOwnerException().code,
        message: new NotCartOwnerException().message,
      })
    }

    const variant = await this.variantRepo.findById(item.variantId)
    if (!variant) {
      throw new NotFoundException({
        code: new VariantNotFoundException().code,
        message: new VariantNotFoundException().message,
      })
    }
    if (!variant.canFulfillQuantity(command.quantity)) {
      throw new BadRequestException({
        code: new InsufficientStockException().code,
        message: new InsufficientStockException().message,
      })
    }

    const persisted = await this.cartRepo.updateItemQuantity(command.cartItemId, command.quantity)
    cart.upsertItem(persisted)

    const view = this.cartViewService.toView(cart)
    await this.cartCache.set(command.userId, view)

    const itemView = view.items.find((i) => i.id === command.cartItemId)
    if (!itemView) {
      // Unreachable: we just upserted this item into the cart we're rendering.
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
