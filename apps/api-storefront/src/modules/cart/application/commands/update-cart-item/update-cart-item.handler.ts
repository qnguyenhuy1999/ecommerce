import {
  BadRequestException,
  ForbiddenException,
  Inject,
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
} from '../../../domain/exceptions/cart.exceptions'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/ports/product-variant.repository.port'
import { CartViewService } from '../../services/cart-view.service'
import type { CartItemView } from '../../views/cart.view'

const CART_CACHE_TTL_SECONDS = 86400

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

    const cart = await this.cartRepo.findCartById(item.cartId)
    if (!cart || !cart.isOwnedBy(command.userId)) {
      throw new ForbiddenException({
        code: new NotCartOwnerException().code,
        message: new NotCartOwnerException().message,
      })
    }

    const variant = await this.variantRepo.findById(item.variantId)
    if (!variant) {
      throw new NotFoundException({
        code: 'VARIANT_NOT_FOUND',
        message: 'Product variant not found',
      })
    }
    if (!variant.canFulfillQuantity(command.quantity)) {
      throw new BadRequestException({
        code: new InsufficientStockException().code,
        message: new InsufficientStockException().message,
      })
    }

    await this.cartRepo.updateItemQuantity(command.cartItemId, command.quantity)
    this.logger.log(
      `Cart item quantity updated: item=${command.cartItemId} qty=${String(command.quantity)}`,
    )

    const refreshed = await this.cartRepo.findByUserIdWithItems(command.userId)
    if (!refreshed) {
      throw new NotFoundException({ code: 'CART_NOT_FOUND', message: 'Cart not found' })
    }
    const view = this.cartViewService.toView(refreshed)
    await this.cartCache.set(command.userId, view, CART_CACHE_TTL_SECONDS)

    const itemView = view.items.find((i) => i.id === command.cartItemId)
    if (!itemView) {
      throw new NotFoundException({
        code: new CartItemNotFoundException().code,
        message: new CartItemNotFoundException().message,
      })
    }
    return itemView
  }
}
