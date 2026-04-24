import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { CartItemEntity } from '../../domain/entities/cart-item.entity'
import { CartEntity } from '../../domain/entities/cart.entity'
import {
  ProductVariantEntity,
  type ProductStatus,
} from '../../domain/entities/product-variant.entity'
import type { ICartRepository } from '../../domain/ports/cart.repository.port'

type VariantWithProduct = {
  id: string
  sku: string
  attributes: unknown
  priceOverride: number | null
  stock: number
  reservedStock: number
  product: {
    id: string
    name: string
    price: number
    status: string
    seller: { id: string; storeName: string }
  }
}

type CartItemRecord = {
  id: string
  cartId: string
  variantId: string
  quantity: number
  variant?: VariantWithProduct
}

type CartRecord = {
  id: string
  userId: string
  items?: CartItemRecord[]
}

const cartItemInclude = {
  variant: {
    include: {
      product: {
        include: {
          seller: { select: { id: true, storeName: true } },
        },
      },
    },
  },
} as const

@Injectable()
export class PrismaCartRepository implements ICartRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findByUserIdWithItems(userId: string): Promise<CartEntity | null> {
    const record = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: cartItemInclude } },
    })
    if (!record) return null
    return this.toCartDomain(record as unknown as CartRecord)
  }

  async createForUser(userId: string): Promise<CartEntity> {
    const record = await this.prisma.cart.create({
      data: { userId },
      include: { items: { include: cartItemInclude } },
    })
    return this.toCartDomain(record as unknown as CartRecord)
  }

  async findCartById(cartId: string): Promise<CartEntity | null> {
    const record = await this.prisma.cart.findUnique({ where: { id: cartId } })
    if (!record) return null
    return new CartEntity({ id: record.id, userId: record.userId, items: [] })
  }

  async findItemByCartAndVariant(
    cartId: string,
    variantId: string,
  ): Promise<CartItemEntity | null> {
    const record = await this.prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } },
      include: cartItemInclude,
    })
    if (!record) return null
    return this.toCartItemDomain(record as unknown as CartItemRecord)
  }

  async findItemById(cartItemId: string): Promise<CartItemEntity | null> {
    const record = await this.prisma.cartItem.findUnique({ where: { id: cartItemId } })
    if (!record) return null
    return this.toCartItemDomain(record)
  }

  async addItem(cartId: string, variantId: string, quantity: number): Promise<CartItemEntity> {
    const record = await this.prisma.cartItem.create({
      data: { cartId, variantId, quantity },
      include: cartItemInclude,
    })
    return this.toCartItemDomain(record as unknown as CartItemRecord)
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItemEntity> {
    const record = await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: cartItemInclude,
    })
    return this.toCartItemDomain(record as unknown as CartItemRecord)
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.prisma.cartItem.delete({ where: { id: itemId } })
  }

  async deleteAllItems(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } })
  }

  private toCartDomain(record: CartRecord): CartEntity {
    const items = (record.items ?? []).map((item) => this.toCartItemDomain(item))
    return new CartEntity({ id: record.id, userId: record.userId, items })
  }

  private toCartItemDomain(record: CartItemRecord): CartItemEntity {
    const variant = record.variant ? this.toVariantDomain(record.variant) : undefined
    return new CartItemEntity({
      id: record.id,
      cartId: record.cartId,
      variantId: record.variantId,
      quantity: record.quantity,
      variant,
    })
  }

  private toVariantDomain(record: VariantWithProduct): ProductVariantEntity {
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
        status: record.product.status as ProductStatus,
        seller: {
          id: record.product.seller.id,
          storeName: record.product.seller.storeName,
        },
      },
    })
  }
}
