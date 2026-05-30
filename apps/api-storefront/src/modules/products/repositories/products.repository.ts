import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { ProductStatus, ReviewStatus } from '@ecom/contracts/enums/product'
import { FlashSaleStatus } from '@ecom/contracts/enums/promotion'

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProductBySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { slug, status: ProductStatus.PUBLISHED, deletedAt: null },
      include: {
        shop: {
          select: { id: true, name: true, slug: true, logo: true, city: true, country: true },
        },
        category: { select: { id: true, name: true, slug: true, parentId: true } },
        images: { orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }] },
        variantOptionGroups: {
          include: { options: { orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          include: {
            optionValues: {
              include: {
                option: { include: { group: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  async aggregateReviews(productId: string) {
    return this.prisma.review.groupBy({
      by: ['productId'],
      where: { productId, status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { productId: true },
    })
  }

  async aggregateSoldItems(variantIds: string[]) {
    return this.prisma.sellerOrderItem.groupBy({
      by: ['variantId'],
      where: { variantId: { in: variantIds } },
      _sum: { quantity: true },
    })
  }

  async findActiveFlashSaleSlot(productId: string) {
    return this.prisma.flashSaleSlot.findFirst({
      where: {
        productId,
        status: 'APPROVED',
        campaign: {
          status: FlashSaleStatus.ACTIVE,
          startsAt: { lte: new Date() },
          endsAt: { gte: new Date() },
        },
      },
      select: { originalPrice: true, salePrice: true, purchaseLimit: true },
    })
  }

  async findCategory(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, parentId: true },
    })
  }

  async findProductScores(productId: string) {
    return this.prisma.productScore.findMany({
      where: { productId: { not: productId }, scoreType: 'POPULARITY' },
      orderBy: { score: 'desc' },
      take: 12,
      select: { productId: true },
    })
  }

  async findRecommendationProducts(where: Record<string, unknown>, take = 6) {
    return this.prisma.product.findMany({
      where,
      include: {
        images: { where: { isCover: true }, take: 1, select: { url: true } },
        shop: { select: { id: true, name: true, slug: true, logo: true } },
        _count: { select: { reviews: true } },
        reviews: { where: { status: ReviewStatus.APPROVED }, select: { rating: true } },
        variants: {
          where: { isActive: true },
          select: { price: true },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
      take,
    })
  }
}
