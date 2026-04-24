import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { AddCartItemCommand } from './add-cart-item.command'
import {
  InsufficientStockException,
  ProductNotActiveException,
  VariantNotFoundException,
} from '../../../domain/exceptions/cart.exceptions'
import { CART_CACHE, ICartCache } from '../../../domain/ports/cart-cache.port'
import { CART_REPOSITORY, ICartRepository } from '../../../domain/ports/cart.repository.port'
import {
  IProductVariantRepository,
  PRODUCT_VARIANT_REPOSITORY,
} from '../../../domain/ports/product-variant.repository.port'
import { CartViewService } from '../../services/cart-view.service'
import type { CartItemView, CartView } from '../../views/cart.view'

export interface AddCartItemResult {
  cartItemId: string
  variant: CartItemView['variant']
  quantity: number
  cart: CartView
}

const CART_CACHE_TTL_SECONDS = 86400

@CommandHandler(AddCartItemCommand)
export class AddCartItemHandler implements ICommandHandler<AddCartItemCommand, AddCartItemResult> {
  private readonly logger = new Logger(AddCartItemHandler.name)

  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepo: ICartRepository,
    @Inject(PRODUCT_VARIANT_REPOSITORY) private readonly variantRepo: IProductVariantRepository,
    @Inject(CART_CACHE) private readonly cartCache: ICartCache,
    private readonly cartViewService: CartViewService,
  ) {}

  async execute(command: AddCartItemCommand): Promise<AddCartItemResult> {
    const variant = await this.variantRepo.findById(command.variantId)
    if (!variant) {
      throw new NotFoundException({
        code: new VariantNotFoundException().code,
        message: new VariantNotFoundException().message,
      })
    }
    if (!variant.isProductActive()) {
      throw new BadRequestException({
        code: new ProductNotActiveException().code,
        message: new ProductNotActiveException().message,
      })
    }

    const cart =
      (await this.cartRepo.findByUserIdWithItems(command.userId)) ??
      (await this.cartRepo.createForUser(command.userId))

    const existing = await this.cartRepo.findItemByCartAndVariant(cart.id, command.variantId)
    const desiredQuantity = (existing?.quantity ?? 0) + command.quantity
    if (!variant.canFulfillQuantity(desiredQuantity)) {
      throw new BadRequestException({
        code: new InsufficientStockException().code,
        message: new InsufficientStockException().message,
      })
    }

    const item = existing
      ? await this.cartRepo.updateItemQuantity(existing.id, desiredQuantity)
      : await this.cartRepo.addItem(cart.id, command.variantId, command.quantity)

    this.logger.log(`Cart item upserted: cart=${cart.id} item=${item.id} qty=${String(item.quantity)}`)

    const refreshed = await this.cartRepo.findByUserIdWithItems(command.userId)
    if (!refreshed) {
      // Unreachable: we just ensured the cart exists above.
      throw new NotFoundException({ code: 'CART_NOT_FOUND', message: 'Cart not found' })
    }
    const view = this.cartViewService.toView(refreshed)
    await this.cartCache.set(command.userId, view, CART_CACHE_TTL_SECONDS)

    const itemView = view.items.find((i) => i.id === item.id)
    if (!itemView) {
      // Unreachable: the item was just persisted and loaded.
      throw new NotFoundException({
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Cart item not found after upsert',
      })
    }

    return {
      cartItemId: item.id,
      variant: itemView.variant,
      quantity: item.quantity,
      cart: view,
    }
  }
}
