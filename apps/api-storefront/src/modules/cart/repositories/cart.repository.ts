import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'

const CART_INCLUDE = {
  items: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          basePrice: true,
          baseStock: true,
          reservedStock: true,
          hasVariants: true,
          status: true,
          deletedAt: true,
          shop: {
            select: { id: true, name: true, slug: true, logo: true, status: true },
          },
          images: {
            where: { isCover: true },
            take: 1,
            select: { url: true },
          },
        },
      },
      variant: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          reservedStock: true,
          isActive: true,
          optionValues: {
            select: {
              option: {
                select: {
                  value: true,
                  group: {
                    select: { name: true, sortOrder: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  platformVoucher: true,
} as const

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertCart(userId: string) {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    })
  }

  async findCartWithItems(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: CART_INCLUDE,
    })
  }

  async findCartItemByKey(cartId: string, itemKey: string) {
    return this.prisma.cartItem.findUnique({
      where: { cartId_itemKey: { cartId, itemKey } },
    })
  }

  async findCartItemById(itemId: string, cartId: string) {
    return this.prisma.cartItem.findFirst({ where: { id: itemId, cartId } })
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })
  }

  async createCartItem(data: {
    cartId: string
    itemKey: string
    productId: string
    variantId: string | null
    quantity: number
  }) {
    return this.prisma.cartItem.create({ data })
  }

  async deleteCartItem(itemId: string) {
    return this.prisma.cartItem.delete({ where: { id: itemId } })
  }

  async findVoucher(code: string) {
    return this.prisma.platformVoucher.findFirst({ where: { code } })
  }

  async setCartVoucher(cartId: string, platformVoucherId: string | null) {
    return this.prisma.cart.update({
      where: { id: cartId },
      data: { platformVoucherId },
    })
  }

  async findCartItemCount(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      select: { _count: { select: { items: true } } },
    })
  }

  async findProduct(productId: string, variantId?: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        status: true,
        deletedAt: true,
        hasVariants: true,
        basePrice: true,
        baseStock: true,
        reservedStock: true,
        shop: { select: { status: true } },
        variants: {
          ...(variantId ? { where: { id: variantId } } : {}),
          select: {
            id: true,
            stock: true,
            reservedStock: true,
            isActive: true,
          },
        },
      },
    })
  }
}
