import { BadRequestException, Injectable } from '@nestjs/common'
import { OrderStatus, Prisma, PrismaClient } from '@prisma/client'

export interface ReviewView {
  id: string
  orderId: string
  sellerId: string
  productId: string
  userId: string
  rating: number
  comment: string | null
  createdAt: string
}

type ReviewedOrderItem = Prisma.OrderItemGetPayload<{
  select: { variant: { select: { productId: true } }; subOrder: { select: { sellerId: true } } }
}>

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(productId?: string): Promise<ReviewView[]> {
    const rows = await this.prisma.review.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return rows.map(toView)
  }

  async create(
    userId: string,
    input: { orderId: string; productId: string; rating: number; comment?: string },
  ): Promise<ReviewView> {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        variant: { productId: input.productId },
        subOrder: {
          orderId: input.orderId,
          order: { buyerId: userId, status: OrderStatus.COMPLETED },
        },
      },
      select: {
        variant: { select: { productId: true } },
        subOrder: { select: { sellerId: true } },
      },
    })
    if (!orderItem) throw new BadRequestException('Only completed purchases can be reviewed')
    const reviewedItem: ReviewedOrderItem = orderItem

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          orderId: input.orderId,
          productId: input.productId,
          sellerId: reviewedItem.subOrder.sellerId,
          userId,
          rating: input.rating,
          comment: input.comment ?? null,
        },
      }).catch((error: unknown) => {
        throw error instanceof Error && error.message.includes('Unique constraint')
          ? new BadRequestException('Product already reviewed for this order')
          : error
      })

      const [productStats, sellerStats] = await Promise.all([
        tx.review.aggregate({
          where: { productId: input.productId },
          _avg: { rating: true },
          _count: { _all: true },
        }),
        tx.review.aggregate({
          where: { sellerId: reviewedItem.subOrder.sellerId },
          _avg: { rating: true },
          _count: { _all: true },
        }),
      ])
      await Promise.all([
        tx.product.update({
          where: { id: input.productId },
          data: {
            rating: productStats._avg.rating ?? 0,
            reviewCount: productStats._count._all,
          },
        }),
        tx.seller.update({
          where: { id: reviewedItem.subOrder.sellerId },
          data: {
            rating: sellerStats._avg.rating ?? 0,
            totalRatings: sellerStats._count._all,
          },
        }),
        tx.auditEvent.create({
          data: {
            actorId: userId,
            action: 'REVIEW_CREATED',
            targetType: 'Product',
            targetId: input.productId,
            metadata: { orderId: input.orderId, rating: input.rating },
          },
        }),
      ])
      return toView(review)
    })
  }
}

function toView(row: {
  id: string
  orderId: string
  sellerId: string
  productId: string
  userId: string
  rating: number
  comment: string | null
  createdAt: Date
}): ReviewView {
  return {
    id: row.id,
    orderId: row.orderId,
    sellerId: row.sellerId,
    productId: row.productId,
    userId: row.userId,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
  }
}
