import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
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

    const existing = cart.findItemByVariantId(command.variantId)
    const desiredQuantity = (existing?.quantity ?? 0) + command.quantity
    if (!variant.canFulfillQuantity(desiredQuantity)) {
      throw new BadRequestException({
        code: new InsufficientStockException().code,
        message: new InsufficientStockException().message,
      })
    }

    const persisted = existing
      ? await this.cartRepo.updateItemQuantity(existing.id, desiredQuantity)
      : await this.cartRepo.addItem(cart.id, command.variantId, command.quantity)
    cart.upsertItem(persisted)

    const view = this.cartViewService.toView(cart)
    await this.cartCache.set(command.userId, view)

    const itemView = view.items.find((i) => i.id === persisted.id)
    if (!itemView) {
      // Unreachable: we just upserted this item into the cart we're rendering.
      throw new InternalServerErrorException({
        code: 'CART_VIEW_INCONSISTENT',
        message: 'Failed to locate just-persisted cart item in the rendered view',
      })
    }

    this.logger.log(`Cart item upserted: cart=${cart.id} item=${persisted.id} qty=${String(persisted.quantity)}`)
    return {
      cartItemId: persisted.id,
      variant: itemView.variant,
      quantity: persisted.quantity,
      cart: view,
    }
  }
}
