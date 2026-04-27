import { Inject } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { OrderStatus, PrismaClient } from '@prisma/client'

import { GetSellerConsoleQuery } from './get-seller-console.query'
import { SellerNotFoundException } from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'
import type { SellerConsoleView } from '../../views/seller-console.view'

@QueryHandler(GetSellerConsoleQuery)
export class GetSellerConsoleHandler implements IQueryHandler<GetSellerConsoleQuery, SellerConsoleView> {
  constructor(
    @Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository,
    @Inject(PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  async execute(query: GetSellerConsoleQuery): Promise<SellerConsoleView> {
    const seller = await this.sellers.findByUserId(query.userId)
    if (!seller) throw new SellerNotFoundException()

    const [products, pendingOrders, subOrderTotals, commissionTotals, ledger] = await Promise.all([
      this.prisma.product.findMany({
        where: { sellerId: seller.id, deletedAt: null },
        include: {
          seller: { select: { id: true, storeName: true, rating: true } },
          variants: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      }),
      this.prisma.subOrder.count({
        where: { sellerId: seller.id, status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING] } },
      }),
      this.prisma.subOrder.aggregate({
        where: { sellerId: seller.id, status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.COMPLETED] } },
        _sum: { subtotal: true },
      }),
      this.prisma.commission.aggregate({
        where: { sellerId: seller.id },
        _sum: { amount: true },
      }),
      this.prisma.sellerLedger.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ])

    const revenue = subOrderTotals._sum.subtotal ?? 0
    const commission = commissionTotals._sum.amount ?? 0

    return {
      seller: {
        id: seller.id,
        storeName: seller.props.storeName,
        storeDescription: seller.props.storeDescription,
        kycStatus: seller.props.kycStatus,
        commissionRate: seller.props.commissionRate,
        rating: seller.props.rating,
        totalRatings: seller.props.totalRatings,
      },
      metrics: {
        products: products.length,
        activeProducts: products.filter((product) => product.status === 'ACTIVE').length,
        pendingOrders,
        revenue,
        commission,
        availableBalance: Math.max(0, revenue - commission),
      },
      products: products.map((product) => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status,
        categoryId: product.categoryId,
        images: product.images,
        rating: product.rating,
        reviewCount: product.reviewCount,
        seller: product.seller,
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          attributes: toRecord(variant.attributes),
          priceOverride: variant.priceOverride,
          stock: variant.stock,
          reservedStock: variant.reservedStock,
          createdAt: variant.createdAt,
          updatedAt: variant.updatedAt,
        })),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      inventory: products.flatMap((product) =>
        product.variants.map((variant) => ({
          productId: product.id,
          productName: product.name,
          variantId: variant.id,
          sku: variant.sku,
          attributes: toRecord(variant.attributes),
          stock: variant.stock,
          reservedStock: variant.reservedStock,
          availableStock: variant.stock - variant.reservedStock,
        })),
      ),
      ledger: ledger.map((entry) => ({
        id: entry.id,
        type: entry.type,
        amount: entry.amount,
        referenceType: entry.referenceType,
        referenceId: entry.referenceId,
        description: entry.description,
        createdAt: entry.createdAt.toISOString(),
      })),
    }
  }
}

function toRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}
