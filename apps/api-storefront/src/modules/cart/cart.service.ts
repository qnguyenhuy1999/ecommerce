import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { SessionData } from '@ecom/auth/session.service'
import type {
  AddCartItemDto,
  ApplyCartVoucherDto,
  CartDto,
  UpdateCartItemDto,
} from './dto/cart.dto'
import { calculateVoucherDiscount, roundMoney } from './cart.utils'
import { CartRepository } from './repositories/cart.repository'

type CartRecord = NonNullable<Awaited<ReturnType<CartRepository['findCartWithItems']>>>

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async getCart(user: SessionData): Promise<CartDto> {
    const cart = await this.loadCart(user.userId)
    return this.normalizeCart(cart)
  }

  async addItem(user: SessionData, dto: AddCartItemDto): Promise<CartDto> {
    const cart = await this.cartRepository.upsertCart(user.userId)
    const selection = await this.resolveSelection(dto.productId, dto.variantId)
    const existingItem = await this.cartRepository.findCartItemByKey(cart.id, selection.itemKey)

    const quantity = (existingItem?.quantity ?? 0) + dto.quantity
    ensureQuantityAvailable(quantity, selection.availableStock)

    if (existingItem) {
      await this.cartRepository.updateCartItem(existingItem.id, quantity)
    } else {
      await this.cartRepository.createCartItem({
        cartId: cart.id,
        itemKey: selection.itemKey,
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        quantity: dto.quantity,
      })
    }

    return this.getCart(user)
  }

  async updateItem(user: SessionData, itemId: string, dto: UpdateCartItemDto): Promise<CartDto> {
    const cart = await this.cartRepository.upsertCart(user.userId)
    const item = await this.cartRepository.findCartItemById(itemId, cart.id)

    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    const selection = await this.resolveSelection(item.productId, item.variantId ?? undefined)
    ensureQuantityAvailable(dto.quantity, selection.availableStock)

    await this.cartRepository.updateCartItem(item.id, dto.quantity)

    return this.getCart(user)
  }

  async removeItem(user: SessionData, itemId: string): Promise<CartDto> {
    const cart = await this.cartRepository.upsertCart(user.userId)
    const item = await this.cartRepository.findCartItemById(itemId, cart.id)

    if (!item) {
      throw new NotFoundException('Cart item not found')
    }

    await this.cartRepository.deleteCartItem(item.id)
    return this.getCart(user)
  }

  async applyVoucher(user: SessionData, dto: ApplyCartVoucherDto): Promise<CartDto> {
    const cart = await this.loadCart(user.userId)
    const subtotal = calculateSubtotal(cart)

    const voucher = await this.cartRepository.findVoucher(dto.code.trim())

    if (!voucher) {
      throw new BadRequestException('Voucher not found')
    }

    const evaluation = calculateVoucherDiscount(
      subtotal,
      {
        status: voucher.status,
        type: voucher.type,
        discountValue: voucher.discountValue.toNumber(),
        maxDiscountAmount: voucher.maxDiscountAmount?.toNumber() ?? null,
        minOrderAmount: voucher.minOrderAmount?.toNumber() ?? null,
        usageLimit: voucher.usageLimit,
        usedCount: voucher.usedCount,
        startsAt: voucher.startsAt,
        expiresAt: voucher.expiresAt,
      },
      new Date(),
    )

    if (evaluation.reason) {
      throw new BadRequestException(evaluation.reason)
    }

    await this.cartRepository.setCartVoucher(cart.id, voucher.id)

    return this.getCart(user)
  }

  async removeVoucher(user: SessionData): Promise<CartDto> {
    const cart = await this.cartRepository.upsertCart(user.userId)
    await this.cartRepository.setCartVoucher(cart.id, null)
    return this.getCart(user)
  }

  async getCartCount(user: SessionData): Promise<{ count: number }> {
    const result = await this.cartRepository.findCartItemCount(user.userId)
    return { count: result?._count.items ?? 0 }
  }

  private async loadCart(userId: string): Promise<CartRecord> {
    await this.cartRepository.upsertCart(userId)

    const cart = await this.cartRepository.findCartWithItems(userId)

    if (!cart) {
      throw new NotFoundException('Cart not found')
    }

    return cart
  }

  private async normalizeCart(cart: CartRecord): Promise<CartDto> {
    const subtotal = calculateSubtotal(cart)
    const now = new Date()

    let voucher = cart.platformVoucher
    let discountTotal = 0

    if (voucher) {
      const evaluation = calculateVoucherDiscount(
        subtotal,
        {
          status: voucher.status,
          type: voucher.type,
          discountValue: voucher.discountValue.toNumber(),
          maxDiscountAmount: voucher.maxDiscountAmount?.toNumber() ?? null,
          minOrderAmount: voucher.minOrderAmount?.toNumber() ?? null,
          usageLimit: voucher.usageLimit,
          usedCount: voucher.usedCount,
          startsAt: voucher.startsAt,
          expiresAt: voucher.expiresAt,
        },
        now,
      )

      if (evaluation.reason) {
        await this.cartRepository.setCartVoucher(cart.id, null)
        voucher = null
      } else {
        discountTotal = evaluation.discountTotal
      }
    }

    const items = cart.items.map((item) => {
      const unitPrice = getItemUnitPrice(item)
      const availableStock = getItemAvailableStock(item)

      return {
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productSlug: item.product.slug,
        coverImage: item.product.images[0]?.url ?? null,
        quantity: item.quantity,
        unitPrice,
        lineTotal: roundMoney(unitPrice * item.quantity),
        availableStock,
        shop: {
          id: item.product.shop.id,
          name: item.product.shop.name,
          slug: item.product.shop.slug,
          logo: item.product.shop.logo,
        },
        variant: item.variant
          ? {
              id: item.variant.id,
              sku: item.variant.sku ?? null,
              label: formatVariantLabel(item.variant.optionValues),
            }
          : null,
      }
    })

    return {
      id: cart.id,
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shippingTotal: 0,
      discountTotal,
      total: roundMoney(Math.max(subtotal - discountTotal, 0)),
      voucher: voucher
        ? {
            id: voucher.id,
            code: voucher.code,
            name: voucher.name,
            type: voucher.type,
            discountValue: voucher.discountValue.toNumber(),
            maxDiscountAmount: voucher.maxDiscountAmount?.toNumber() ?? null,
            minOrderAmount: voucher.minOrderAmount?.toNumber() ?? null,
            discountTotal,
            expiresAt: voucher.expiresAt,
          }
        : null,
    }
  }

  private async resolveSelection(productId: string, variantId?: string) {
    const product = await this.cartRepository.findProduct(productId, variantId)

    if (
      !product ||
      product.deletedAt !== null ||
      product.status !== 'PUBLISHED' ||
      product.shop.status !== 'ACTIVE'
    ) {
      throw new BadRequestException('Product is not available')
    }

    if (product.hasVariants) {
      if (!variantId) {
        throw new BadRequestException('Variant is required for this product')
      }

      const variant = product.variants[0]
      if (!variant || !variant.isActive) {
        throw new BadRequestException('Variant is not available')
      }

      return {
        itemKey: `${product.id}:${variant.id}`,
        availableStock: variant.stock - variant.reservedStock,
      }
    }

    if (variantId) {
      throw new BadRequestException('Variant is not allowed for this product')
    }

    if (product.basePrice === null) {
      throw new BadRequestException('Product is not available')
    }

    return {
      itemKey: `${product.id}:base`,
      availableStock: product.baseStock - product.reservedStock,
    }
  }
}

function calculateSubtotal(cart: CartRecord): number {
  return roundMoney(
    cart.items.reduce((sum, item) => {
      const unitPrice = getItemUnitPrice(item)
      return sum + unitPrice * item.quantity
    }, 0),
  )
}

function getItemUnitPrice(item: CartRecord['items'][number]): number {
  return item.variant?.price.toNumber() ?? item.product.basePrice?.toNumber() ?? 0
}

function getItemAvailableStock(item: CartRecord['items'][number]): number {
  if (item.variant) {
    return item.variant.stock - item.variant.reservedStock
  }

  return item.product.baseStock - item.product.reservedStock
}

function ensureQuantityAvailable(quantity: number, availableStock: number) {
  if (availableStock <= 0) {
    throw new BadRequestException('Product is out of stock')
  }

  if (quantity > availableStock) {
    throw new BadRequestException(`Only ${availableStock} item(s) available`)
  }
}

function formatVariantLabel(
  optionValues: Array<{ option: { value: string; group: { name: string; sortOrder: number } } }>,
): string {
  return optionValues
    .slice()
    .sort((left, right) => left.option.group.sortOrder - right.option.group.sortOrder)
    .map((entry) => `${entry.option.group.name}: ${entry.option.value}`)
    .join(' / ')
}
