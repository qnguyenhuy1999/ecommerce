import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { deleteCartRedis, setCartRedis } from '@ecom/redis'

import type { AddCartItemDto } from './dto/add-cart-item.dto'
import type { UpdateCartItemDto } from './dto/update-cart-item.dto'
import { PrismaService } from '../../prisma/prisma.service'

const CART_CACHE_TTL_SECONDS = 86400

interface CartItemWithRelations {
  id: string
  quantity: number
  variant: {
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
      seller: {
        id: string
        storeName: string
      }
    }
  }
}

interface FormattedCartItem {
  id: string
  quantity: number
  variant: {
    id: string
    sku: string
    attributes: unknown
    priceOverride: number | null
    effectivePrice: number
    product: { id: string; name: string }
  }
  seller: { id: string; storeName: string }
}

interface SellerGroup {
  sellerId: string
  storeName: string
  items: FormattedCartItem[]
  subtotal: number
}

interface FormattedCart {
  id: string
  items: FormattedCartItem[]
  subtotal: number
  sellerGroups: SellerGroup[]
  itemCount: number
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

function cartCacheKey(userId: string): string {
  return `cart:${userId}`
}

function effectivePriceOf(item: CartItemWithRelations): number {
  return item.variant.priceOverride ?? item.variant.product.price
}

function availableStock(variant: { stock: number; reservedStock: number }): number {
  return Math.max(0, variant.stock - variant.reservedStock)
}

function formatCart(cart: { id: string; items: CartItemWithRelations[] }): FormattedCart {
  const items: FormattedCartItem[] = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    variant: {
      id: item.variant.id,
      sku: item.variant.sku,
      attributes: item.variant.attributes,
      priceOverride: item.variant.priceOverride,
      effectivePrice: effectivePriceOf(item),
      product: { id: item.variant.product.id, name: item.variant.product.name },
    },
    seller: {
      id: item.variant.product.seller.id,
      storeName: item.variant.product.seller.storeName,
    },
  }))

  const subtotal = cart.items.reduce(
    (sum, item) => sum + effectivePriceOf(item) * item.quantity,
    0,
  )
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  const groupsMap = new Map<string, SellerGroup>()
  for (const item of items) {
    const existing = groupsMap.get(item.seller.id)
    const original = cart.items.find((ci) => ci.id === item.id) as CartItemWithRelations
    const lineTotal = effectivePriceOf(original) * item.quantity
    if (existing) {
      existing.items.push(item)
      existing.subtotal += lineTotal
    } else {
      groupsMap.set(item.seller.id, {
        sellerId: item.seller.id,
        storeName: item.seller.storeName,
        items: [item],
        subtotal: lineTotal,
      })
    }
  }

  return {
    id: cart.id,
    items,
    subtotal,
    sellerGroups: Array.from(groupsMap.values()),
    itemCount,
  }
}

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string): Promise<FormattedCart> {
    const cart = await this.ensureCartWithItems(userId)
    const formatted = formatCart(cart)
    await setCartRedis(cartCacheKey(userId), formatted, CART_CACHE_TTL_SECONDS)
    return formatted
  }

  async addItem(
    userId: string,
    dto: AddCartItemDto,
  ): Promise<{
    cartItemId: string
    variant: FormattedCartItem['variant']
    quantity: number
    cart: FormattedCart
  }> {
    const cart = await this.ensureCart(userId)

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
      include: { product: true },
    })
    if (!variant) {
      throw new NotFoundException({
        code: 'VARIANT_NOT_FOUND',
        message: 'Product variant not found',
      })
    }
    if (variant.product.status !== 'ACTIVE') {
      throw new BadRequestException({
        code: 'PRODUCT_NOT_ACTIVE',
        message: 'Product is not available for purchase',
      })
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
    })
    const desiredQuantity = (existing?.quantity ?? 0) + dto.quantity
    if (desiredQuantity > availableStock(variant)) {
      throw new BadRequestException({
        code: 'INSUFFICIENT_STOCK',
        message: 'Requested quantity exceeds available stock',
      })
    }

    const item = existing
      ? await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: desiredQuantity },
        })
      : await this.prisma.cartItem.create({
          data: { cartId: cart.id, variantId: variant.id, quantity: dto.quantity },
        })

    await deleteCartRedis(cartCacheKey(userId))
    const refreshed = await this.getCart(userId)
    const formattedItem = refreshed.items.find((i) => i.id === item.id)
    if (!formattedItem) {
      throw new NotFoundException({
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Cart item not found after update',
      })
    }

    return {
      cartItemId: item.id,
      variant: formattedItem.variant,
      quantity: item.quantity,
      cart: refreshed,
    }
  }

  async updateItem(
    userId: string,
    cartItemId: string,
    dto: UpdateCartItemDto,
  ): Promise<FormattedCartItem> {
    if (dto.quantity < 1) {
      throw new BadRequestException({
        code: 'INVALID_QUANTITY',
        message: 'Quantity must be at least 1',
      })
    }

    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true, variant: true },
    })
    if (!item) {
      throw new NotFoundException({
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Cart item not found',
      })
    }
    if (item.cart.userId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_CART_OWNER',
        message: 'Cart item does not belong to the current user',
      })
    }
    if (dto.quantity > availableStock(item.variant)) {
      throw new BadRequestException({
        code: 'INSUFFICIENT_STOCK',
        message: 'Requested quantity exceeds available stock',
      })
    }

    await this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: dto.quantity },
    })

    await deleteCartRedis(cartCacheKey(userId))
    const refreshed = await this.getCart(userId)
    const formattedItem = refreshed.items.find((i) => i.id === cartItemId)
    if (!formattedItem) {
      throw new NotFoundException({
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Cart item not found after update',
      })
    }
    return formattedItem
  }

  async removeItem(userId: string, cartItemId: string): Promise<void> {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true },
    })
    if (!item) {
      throw new NotFoundException({
        code: 'CART_ITEM_NOT_FOUND',
        message: 'Cart item not found',
      })
    }
    if (item.cart.userId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_CART_OWNER',
        message: 'Cart item does not belong to the current user',
      })
    }

    await this.prisma.cartItem.delete({ where: { id: cartItemId } })
    await deleteCartRedis(cartCacheKey(userId))
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } })
    if (cart) {
      await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
    }
    await deleteCartRedis(cartCacheKey(userId))
  }

  private async ensureCart(userId: string): Promise<{ id: string; userId: string }> {
    const existing = await this.prisma.cart.findUnique({ where: { userId } })
    if (existing) return existing
    return this.prisma.cart.create({ data: { userId } })
  }

  private async ensureCartWithItems(
    userId: string,
  ): Promise<{ id: string; items: CartItemWithRelations[] }> {
    const existing = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: cartItemInclude } },
    })
    if (existing) return existing as unknown as { id: string; items: CartItemWithRelations[] }

    const created = await this.prisma.cart.create({
      data: { userId },
      include: { items: { include: cartItemInclude } },
    })
    return created as unknown as { id: string; items: CartItemWithRelations[] }
  }
}
