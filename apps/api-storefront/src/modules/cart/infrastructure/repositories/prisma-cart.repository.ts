import { Inject, Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import { CartItemEntity } from '../../domain/entities/cart-item.entity'
import { CartEntity } from '../../domain/entities/cart.entity'
import { ProductVariantEntity } from '../../domain/entities/product-variant.entity'
import { InsufficientStockException } from '../../domain/exceptions/cart.exceptions'
import type {
  CartItemWithCart,
  ICartRepository,
  IncrementItemInput,
} from '../../domain/ports/cart.repository.port'

const CART_ITEM_INCLUDE = {
  variant: {
    include: {
      product: {
        include: {
          seller: { select: { id: true, storeName: true } },
        },
      },
    },
  },
} satisfies Prisma.CartItemInclude

const CART_WITH_ITEMS_INCLUDE = {
  items: { include: CART_ITEM_INCLUDE },
} satisfies Prisma.CartInclude

type CartItemRow = Prisma.CartItemGetPayload<{ include: typeof CART_ITEM_INCLUDE }>
type CartWithItemsRow = Prisma.CartGetPayload<{ include: typeof CART_WITH_ITEMS_INCLUDE }>
type VariantRow = CartItemRow['variant']

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findByUserIdWithItems(userId: string): Promise<CartEntity | null> {
    const record = await this.prisma.cart.findUnique({
      where: { userId },
      include: CART_WITH_ITEMS_INCLUDE,
    })
    return record ? this.toCartDomain(record) : null
  }

  async upsertForUser(userId: string): Promise<CartEntity> {
    const record = await this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: CART_WITH_ITEMS_INCLUDE,
    })
    return this.toCartDomain(record)
  }

  async findItemByCartAndVariant(
    cartId: string,
    variantId: string,
  ): Promise<CartItemEntity | null> {
    const record = await this.prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } },
      include: CART_ITEM_INCLUDE,
    })
    return record ? this.toCartItemDomain(record) : null
  }

  async findItemWithCart(cartItemId: string): Promise<CartItemWithCart | null> {
    const record = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { ...CART_ITEM_INCLUDE, cart: { select: { id: true, userId: true } } },
    })
    if (!record) return null
    const { cart, ...itemRecord } = record
    return {
      item: this.toCartItemDomain(itemRecord),
      cart: new CartEntity({ id: cart.id, userId: cart.userId, items: [] }),
    }
  }

  async incrementItemQuantity(input: IncrementItemInput): Promise<CartItemEntity> {
    const { cartId, variantId, incrementBy, maxQuantity } = input
    const record = await this.prisma.$transaction(async (tx) => {
      const upserted = await tx.cartItem.upsert({
        where: { cartId_variantId: { cartId, variantId } },
        create: { cartId, variantId, quantity: incrementBy },
        update: { quantity: { increment: incrementBy } },
        include: CART_ITEM_INCLUDE,
      })
      if (upserted.quantity > maxQuantity) {
        // Aborts the transaction and rolls back the increment, so concurrent
        // add-to-cart requests cannot exceed `maxQuantity` in aggregate.
        throw new InsufficientStockException()
      }
      return upserted
    })
    return this.toCartItemDomain(record)
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItemEntity> {
    const record = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: CART_ITEM_INCLUDE,
    })
    return this.toCartItemDomain(record)
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id: itemId } })
  }

  async deleteAllItems(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } })
  }

  private toCartDomain(record: CartWithItemsRow): CartEntity {
    const items = record.items.map((item) => this.toCartItemDomain(item))
    return new CartEntity({ id: record.id, userId: record.userId, items })
  }

  private toCartItemDomain(record: CartItemRow): CartItemEntity {
    return new CartItemEntity({
      id: record.id,
      cartId: record.cartId,
      variantId: record.variantId,
      quantity: record.quantity,
      variant: this.toVariantDomain(record.variant),
    })
  }

  private toVariantDomain(record: VariantRow): ProductVariantEntity {
    return new ProductVariantEntity({
      id: record.id,
      sku: record.sku,
      attributes: record.attributes,
      priceOverride: record.priceOverride,
      stock: record.stock,
      reservedStock: record.reservedStock,
      product: {
        id: record.product.id,
        name: record.product.name,
        price: record.product.price,
        status: record.product.status,
        seller: {
          id: record.product.seller.id,
          storeName: record.product.seller.storeName,
        },
      },
    })
  }
}
