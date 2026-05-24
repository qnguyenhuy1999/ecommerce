import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@ecom/database';
import { type Prisma } from '@ecom/database'
import { CouponStatus, ProductStatus, ReviewStatus, ShopStatus } from '@ecom/contracts/enums'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import type { ShopProductsQueryDto, ShopReviewsQueryDto } from './dto/shop-page.dto'

type ShopRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  banner: string | null
  phone: string | null
  email: string | null
  city: string | null
  state: string | null
  country: string | null
  createdAt: Date
}

type ProductRecord = {
  id: string
  shopId: string
  name: string
  slug: string
  description: string | null
  basePrice: unknown
  createdAt: Date
  images: Array<{ url: string; alt: string | null }>
  shop: { id: string; name: string; slug: string; logo: string | null }
  category: { id: string; name: string; slug: string } | null
  variants: Array<{ id: string; price: unknown }>
}

type ProductReviewAggregate = {
  productId: string
  _avg: { rating: number | null }
  _count: { productId: number }
}

type SoldAggregate = {
  variantId: string
  _sum: { quantity: number | null }
}

type ScoreAggregate = {
  productId: string
  score: unknown
}

type ShopRatingBreakdownRow = {
  rating: number
  _count: { rating: number }
}

type ProductCard = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  imageUrl: string | null
  averageRating: number
  reviewCount: number
  soldCount: number
  createdAt: Date
  shop: { id: string; name: string; slug: string; logo: string | null }
  category: { id: string; name: string; slug: string } | null
  popularityScore: number
}

const SHOP_PRODUCT_SORTS = ['popular', 'newest', 'price-asc', 'price-desc'] as const

@Injectable()
export class ShopPageService {
  constructor(private readonly prisma: PrismaService) {}

  async getShopPage(slug: string) {
    const shop = await this.getShopOrThrow(slug)
    const now = new Date()

    const [
      productCount,
      vouchersCount,
      reviewCount,
      latestMetrics,
      vouchers,
      ratingBreakdown,
      productCards,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { shopId: shop.id, status: ProductStatus.PUBLISHED, deletedAt: null },
      }),
      this.prisma.coupon.count({
        where: {
          shopId: shop.id,
          status: CouponStatus.ACTIVE,
          startsAt: { lte: now },
          expiresAt: { gte: now },
        },
      }),
      this.prisma.review.count({
        where: {
          status: ReviewStatus.APPROVED,
          product: { shopId: shop.id },
        },
      }),
      this.prisma.sellerMetricSnapshot.findFirst({
        where: { shopId: shop.id },
        orderBy: { date: 'desc' },
        select: { responseRate: true },
      }),
      this.prisma.coupon.findMany({
        where: {
          shopId: shop.id,
          status: CouponStatus.ACTIVE,
          startsAt: { lte: now },
          expiresAt: { gte: now },
        },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          type: true,
          discountValue: true,
          maxDiscountAmount: true,
          minOrderAmount: true,
          expiresAt: true,
        },
        orderBy: [{ discountValue: 'desc' }, { expiresAt: 'asc' }],
        take: 4,
      }),
      this.getShopRatingBreakdown(shop.id),
      this.getShopProductCards(shop.id),
    ])

    const featuredProducts = this.selectFeaturedProducts(productCards)
    const bestSellers = [...productCards]
      .sort(
        (left, right) =>
          right.soldCount - left.soldCount || right.createdAt.getTime() - left.createdAt.getTime(),
      )
      .slice(0, 6)
      .map(({ popularityScore: _popularityScore, ...product }) => product)
    const previewProducts = [...productCards]
      .sort((left, right) => this.compareProducts(left, right, 'popular'))
      .slice(0, 12)
      .map(({ popularityScore: _popularityScore, ...product }) => product)
    const totalSoldCount = productCards.reduce((sum, product) => sum + product.soldCount, 0)

    return {
      shop: this.toShopSummary(shop),
      stats: {
        productCount,
        reviewCount,
        averageRating: this.averageFromRatingBreakdown(ratingBreakdown),
        responseRate: this.roundToOneDecimal(this.toNumber(latestMetrics?.responseRate) ?? 0),
        soldCount: totalSoldCount,
      },
      social: {
        followersCount: null,
      },
      highlights: {
        joinedYear: shop.createdAt.getUTCFullYear(),
        shipsFrom: shop.city ?? shop.state ?? shop.country ?? null,
        officialShop: true,
      },
      vouchersPreview: vouchers.map((voucher) => ({
        id: voucher.id,
        code: voucher.code,
        name: voucher.name,
        description: voucher.description,
        type: voucher.type,
        discountValue: this.toNumber(voucher.discountValue) ?? 0,
        maxDiscountAmount: this.toNumber(voucher.maxDiscountAmount),
        minOrderAmount: this.toNumber(voucher.minOrderAmount),
        expiresAt: voucher.expiresAt,
      })),
      featuredProducts,
      bestSellers,
      tabs: {
        home: true,
        products: productCount,
        vouchers: vouchersCount,
        reviews: reviewCount,
      },
      productsPreview: buildOffsetResponse(previewProducts, 1, 12, productCards.length),
    }
  }

  async getShopProducts(slug: string, query: ShopProductsQueryDto) {
    const shop = await this.getShopOrThrow(slug)
    const productCards = await this.getShopProductCards(shop.id)

    const selectedMinRating = this.parseSelectedMinRating(query.ratings)
    const filteredProducts = productCards.filter((product) => {
      if (query.minPrice !== undefined && product.price < query.minPrice) return false
      if (query.maxPrice !== undefined && product.price > query.maxPrice) return false
      if (selectedMinRating !== null && product.averageRating < selectedMinRating) return false
      return true
    })

    const sortedProducts = [...filteredProducts].sort((left, right) =>
      this.compareProducts(left, right, query.sort ?? 'popular'),
    )
    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const start = (page - 1) * limit
    const pagedProducts = sortedProducts
      .slice(start, start + limit)
      .map(({ popularityScore: _popularityScore, ...product }) => product)
    const allPrices = productCards.map((product) => product.price)

    return {
      shop: this.toShopCardSummary(shop),
      products: buildOffsetResponse(pagedProducts, page, limit, sortedProducts.length),
      filters: {
        priceRange: {
          min: allPrices.length > 0 ? Math.min(...allPrices) : null,
          max: allPrices.length > 0 ? Math.max(...allPrices) : null,
          selectedMin: query.minPrice ?? null,
          selectedMax: query.maxPrice ?? null,
        },
        ratingBuckets: [5, 4, 3].map((rating) => ({
          rating,
          count: productCards.filter((product) => product.averageRating >= rating).length,
          isSelected: selectedMinRating === rating,
        })),
      },
      sort: {
        current: query.sort ?? 'popular',
        options: [...SHOP_PRODUCT_SORTS],
      },
    }
  }

  async getShopReviews(slug: string, query: ShopReviewsQueryDto) {
    const shop = await this.getShopOrThrow(slug)
    const [ratingBreakdown, totalReviewCount, reviews] = await Promise.all([
      this.getShopRatingBreakdown(shop.id),
      this.prisma.review.count({
        where: {
          status: ReviewStatus.APPROVED,
          product: { shopId: shop.id },
        },
      }),
      this.prisma.review.findMany({
        where: {
          status: ReviewStatus.APPROVED,
          product: { shopId: shop.id },
          ...(query.rating !== undefined ? { rating: query.rating } : {}),
          ...(query.withMedia ? { images: { some: {} } } : {}),
        },
        select: {
          id: true,
          rating: true,
          title: true,
          comment: true,
          createdAt: true,
          buyer: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              sortOrder: true,
            },
            orderBy: { sortOrder: 'asc' },
          },
          replies: {
            select: {
              id: true,
              message: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'asc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const start = (page - 1) * limit
    const reviewItems = reviews.slice(start, start + limit).map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      createdAt: review.createdAt,
      buyer: {
        displayName: this.toBuyerDisplayName(
          review.buyer.firstName,
          review.buyer.lastName,
          review.buyer.email,
        ),
      },
      product: review.product,
      images: review.images,
      reply: review.replies[0] ?? null,
    }))

    return {
      shop: this.toShopCardSummary(shop),
      summary: {
        averageRating: this.averageFromRatingBreakdown(ratingBreakdown),
        reviewCount: totalReviewCount,
        ratingBreakdown: [5, 4, 3, 2, 1].map((rating) => ({
          rating,
          count: ratingBreakdown.find((row) => row.rating === rating)?._count.rating ?? 0,
        })),
      },
      reviews: buildOffsetResponse(reviewItems, page, limit, reviews.length),
    }
  }

  private async getShopOrThrow(slug: string): Promise<ShopRecord> {
    const shop = await this.prisma.shop.findFirst({
      where: { slug, status: ShopStatus.ACTIVE },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        banner: true,
        phone: true,
        email: true,
        city: true,
        state: true,
        country: true,
        createdAt: true,
      },
    })

    if (!shop) throw new NotFoundException('Shop not found')
    return shop
  }

  private async getShopRatingBreakdown(shopId: string) {
    const args = {
      by: ['rating'],
      where: {
        status: ReviewStatus.APPROVED,
        product: { shopId },
      },
      _count: { rating: true },
    } satisfies Prisma.ReviewGroupByArgs

    const rows = await this.prisma.review.groupBy(args)
    return rows as ShopRatingBreakdownRow[]
  }

  private async getShopProductCards(shopId: string): Promise<ProductCard[]> {
    const products = await this.prisma.product.findMany({
      where: {
        shopId,
        status: ProductStatus.PUBLISHED,
        deletedAt: null,
      },
      select: {
        id: true,
        shopId: true,
        name: true,
        slug: true,
        description: true,
        basePrice: true,
        createdAt: true,
        images: {
          where: { isCover: true },
          select: { url: true, alt: true },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
        shop: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        variants: {
          where: { isActive: true },
          select: { id: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const uniqueProducts = [
      ...new Map(products.map((product) => [product.id, product])).values(),
    ] as ProductRecord[]
    if (uniqueProducts.length === 0) return []

    const productIds = uniqueProducts.map((product) => product.id)
    const variantIds = uniqueProducts.flatMap((product) =>
      product.variants.map((variant) => variant.id),
    )

    const [reviewRows, soldRows, scoreRows] = await Promise.all([
      this.prisma.review.groupBy({
        by: ['productId'],
        where: {
          status: ReviewStatus.APPROVED,
          productId: { in: productIds },
          product: { shopId },
        },
        _avg: { rating: true },
        _count: { productId: true },
      }),
      variantIds.length
        ? this.prisma.sellerOrderItem.groupBy({
            by: ['variantId'],
            where: { variantId: { in: variantIds } },
            _sum: { quantity: true },
          })
        : Promise.resolve([] as SoldAggregate[]),
      productIds.length
        ? this.prisma.productScore.findMany({
            where: {
              productId: { in: productIds },
              scoreType: 'POPULARITY',
            },
            select: { productId: true, score: true },
          })
        : Promise.resolve([] as ScoreAggregate[]),
    ])

    const reviewByProductId = new Map(
      reviewRows.map((row: ProductReviewAggregate) => [
        row.productId,
        {
          averageRating: this.roundToOneDecimal(row._avg.rating ?? 0),
          reviewCount: row._count.productId,
        },
      ]),
    )
    const soldByVariantId = new Map(
      soldRows.map((row: SoldAggregate) => [row.variantId, row._sum.quantity ?? 0]),
    )
    const scoreByProductId = new Map(
      scoreRows.map((row: ScoreAggregate) => [row.productId, this.toNumber(row.score) ?? 0]),
    )

    return uniqueProducts.map((product) => {
      const price = this.getEffectivePrice(product)
      const reviewStats = reviewByProductId.get(product.id) ?? { averageRating: 0, reviewCount: 0 }
      const soldCount = product.variants.reduce(
        (sum, variant) => sum + (soldByVariantId.get(variant.id) ?? 0),
        0,
      )

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price,
        imageUrl: product.images[0]?.url ?? null,
        averageRating: reviewStats.averageRating,
        reviewCount: reviewStats.reviewCount,
        soldCount,
        createdAt: product.createdAt,
        shop: {
          id: product.shop.id,
          name: product.shop.name,
          slug: product.shop.slug,
          logo: product.shop.logo,
        },
        category: product.category,
        popularityScore: scoreByProductId.get(product.id) ?? 0,
      }
    })
  }

  private getEffectivePrice(product: ProductRecord) {
    const variantPrices = product.variants
      .map((variant) => this.toNumber(variant.price))
      .filter((price): price is number => price !== null)

    if (variantPrices.length > 0) return Math.min(...variantPrices)
    return this.toNumber(product.basePrice) ?? 0
  }

  private selectFeaturedProducts(products: ProductCard[]) {
    return [...products]
      .sort(
        (left, right) =>
          right.popularityScore - left.popularityScore ||
          right.createdAt.getTime() - left.createdAt.getTime(),
      )
      .slice(0, 6)
      .map(({ popularityScore: _popularityScore, ...product }) => product)
  }

  private compareProducts(
    left: ProductCard,
    right: ProductCard,
    sort: (typeof SHOP_PRODUCT_SORTS)[number],
  ) {
    if (sort === 'price-asc')
      return left.price - right.price || right.createdAt.getTime() - left.createdAt.getTime()
    if (sort === 'price-desc')
      return right.price - left.price || right.createdAt.getTime() - left.createdAt.getTime()
    if (sort === 'newest') return right.createdAt.getTime() - left.createdAt.getTime()

    const leftScore = left.popularityScore + left.soldCount + left.averageRating
    const rightScore = right.popularityScore + right.soldCount + right.averageRating
    return rightScore - leftScore || right.createdAt.getTime() - left.createdAt.getTime()
  }

  private parseSelectedMinRating(ratings: string | undefined): number | null {
    if (!ratings) return null

    const parsed = ratings
      .split(',')
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isInteger(value))

    return parsed.length > 0 ? Math.max(...parsed) : null
  }

  private averageFromRatingBreakdown(rows: ShopRatingBreakdownRow[]) {
    const totalReviews = rows.reduce((sum, row) => sum + row._count.rating, 0)
    if (totalReviews === 0) return 0

    const weightedSum = rows.reduce((sum, row) => sum + row.rating * row._count.rating, 0)
    return this.roundToOneDecimal(weightedSum / totalReviews)
  }

  private toShopSummary(shop: ShopRecord) {
    return {
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      description: shop.description,
      logo: shop.logo,
      banner: shop.banner,
      phone: shop.phone,
      email: shop.email,
      createdAt: shop.createdAt,
      location: {
        city: shop.city,
        state: shop.state,
        country: shop.country,
      },
    }
  }

  private toShopCardSummary(shop: ShopRecord) {
    return {
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      logo: shop.logo,
    }
  }

  private toBuyerDisplayName(firstName: string | null, lastName: string | null, email: string) {
    const fullName = [firstName, lastName]
      .filter((value): value is string => Boolean(value))
      .join(' ')
      .trim()
    if (fullName.length > 0) return fullName

    return email.split('@')[0] ?? email
  }

  private roundToOneDecimal(value: number) {
    return Math.round(value * 10) / 10
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : null
    }
    if (
      value &&
      typeof value === 'object' &&
      'toNumber' in value &&
      typeof (value as { toNumber?: unknown }).toNumber === 'function'
    ) {
      return (value as { toNumber(): number }).toNumber()
    }
    return null
  }
}
