import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { FlashSaleStatus, ProductStatus, ReviewStatus } from '@ecom/contracts/enums'

type DecimalLike = { toNumber(): number } | null | undefined

type BreadcrumbNode = {
  id: string
  name: string
  slug: string
  parentId: string | null
}

type RecommendationRow = {
  id: string
  name: string
  slug: string
  shopId: string
  basePrice: DecimalLike
  images: Array<{ url: string }>
  shop: { id: string; name: string; slug: string; logo: string | null }
  _count: { reviews: number }
  reviews: Array<{ rating: number }>
  variants: Array<{ price: DecimalLike }>
}

type BreadcrumbDto = {
  id: string
  name: string
  slug: string
}

type RecommendationDto = {
  id: string
  name: string
  slug: string
  shopId: string
  price: number
  coverImage: string | null
  rating: number | null
  reviewCount: number
  shop: { id: string; name: string; slug: string; logo: string | null }
}

type ReviewAggregateRow = {
  _avg: { rating: number | null }
  _count: { productId: number }
}

type SoldAggregateRow = {
  _sum: { quantity: number | null }
}

type FlashSaleSlotRow = {
  originalPrice: DecimalLike
  salePrice: DecimalLike
  purchaseLimit: number
} | null

type ProductImageRow = {
  id: string
  url: string
  alt: string | null
  isCover: boolean
}

type ProductOptionRow = {
  id: string
  value: string
}

type ProductOptionGroupRow = {
  id: string
  name: string
  options: ProductOptionRow[]
}

type ProductVariantOptionValueRow = {
  option: {
    id: string
    value: string
    group: {
      id: string
      name: string
    }
  }
}

type ProductVariantRow = {
  id: string
  sku: string | null
  price: DecimalLike
  stock: number
  reservedStock: number
  optionValues: ProductVariantOptionValueRow[]
}

type ProductShopRow = {
  id: string
  name: string
  slug: string
  logo: string | null
  city: string | null
  country: string | null
}

type ProductDetailRow = {
  id: string
  name: string
  slug: string
  description: string | null
  basePrice: DecimalLike
  baseSku: string | null
  baseStock: number
  reservedStock: number
  categoryId: string | null
  images: ProductImageRow[]
  variantOptionGroups: ProductOptionGroupRow[]
  variants: ProductVariantRow[]
  shop: ProductShopRow
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductDetail(slug: string) {
    const product = await this.prisma.product.findFirst({
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
                option: {
                  include: { group: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!product) throw new NotFoundException('Product not found')

    const [reviewRows, soldRows, flashSaleSlot, breadcrumbs, recommendations] = await Promise.all([
      this.prisma.review.groupBy({
        by: ['productId'],
        where: { productId: product.id, status: ReviewStatus.APPROVED },
        _avg: { rating: true },
        _count: { productId: true },
      }),
      this.prisma.sellerOrderItem.groupBy({
        by: ['variantId'],
        where: { variantId: { in: product.variants.map((variant) => variant.id) } },
        _sum: { quantity: true },
      }),
      this.prisma.flashSaleSlot.findFirst({
        where: {
          productId: product.id,
          status: 'APPROVED',
          campaign: {
            status: FlashSaleStatus.ACTIVE,
            startsAt: { lte: new Date() },
            endsAt: { gte: new Date() },
          },
        },
        select: { originalPrice: true, salePrice: true, purchaseLimit: true },
      }),
      this.buildBreadcrumbs(product.categoryId),
      this.getRecommendations(product.id, product.categoryId),
    ])

    return this.mapProductDetail(
      product,
      reviewRows[0],
      soldRows,
      flashSaleSlot,
      breadcrumbs,
      recommendations,
    )
  }

  private async buildBreadcrumbs(categoryId: string | null) {
    if (!categoryId) return []

    const chain: BreadcrumbNode[] = []
    let cursor: string | null = categoryId

    while (cursor) {
      const category: BreadcrumbNode | null = await this.prisma.category.findUnique({
        where: { id: cursor },
        select: { id: true, name: true, slug: true, parentId: true },
      })

      if (!category) break

      chain.push(category)
      cursor = category.parentId
    }

    chain.reverse()

    return chain.map(({ id, name, slug }) => ({ id, name, slug }))
  }

  private async getRecommendations(productId: string, categoryId: string | null) {
    const sameCategoryWhere: Record<string, unknown> = {
      id: { not: productId },
      status: ProductStatus.PUBLISHED,
      deletedAt: null,
    }

    if (categoryId) {
      sameCategoryWhere.categoryId = categoryId
    }

    const sameCategory = await this.queryRecommendationProducts(sameCategoryWhere)

    if (sameCategory.length >= 6) return sameCategory.slice(0, 6)

    const scores =
      (await this.prisma.productScore.findMany({
        where: {
          productId: { not: productId },
          scoreType: 'POPULARITY',
        },
        orderBy: { score: 'desc' },
        take: 12,
        select: { productId: true },
      })) ?? []

    if (scores.length === 0) return sameCategory

    const scoreIds = scores.map((score) => score.productId)
    const fallbackRows = await this.queryRecommendationProducts(
      {
        id: { in: scoreIds, not: productId },
        status: ProductStatus.PUBLISHED,
        deletedAt: null,
      },
      12,
    )

    const fallbackById = new Map(fallbackRows.map((row) => [row.id, row] as const))
    const deduped = [...sameCategory]

    for (const productIdFromScore of scoreIds) {
      const row = fallbackById.get(productIdFromScore)
      if (!row || deduped.some((item) => item.id === row.id)) continue

      deduped.push(row)
      if (deduped.length === 6) break
    }

    return deduped
  }

  private async queryRecommendationProducts(
    where: Record<string, unknown>,
    take = 6,
  ): Promise<RecommendationDto[]> {
    const rows = await this.prisma.product.findMany({
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

    return rows.map((row) => this.mapRecommendation(row))
  }

  private mapRecommendation(row: RecommendationRow): RecommendationDto {
    const rating =
      row.reviews.length > 0
        ? Math.round(
            (row.reviews.reduce((sum, review) => sum + review.rating, 0) / row.reviews.length) * 10,
          ) / 10
        : null

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      shopId: row.shopId,
      price: this.toNumber(row.variants[0]?.price) ?? this.toNumber(row.basePrice) ?? 0,
      coverImage: row.images[0]?.url ?? null,
      rating,
      reviewCount: row._count.reviews,
      shop: row.shop,
    }
  }

  private mapProductDetail(
    product: ProductDetailRow,
    reviewRow: ReviewAggregateRow | undefined,
    soldRows: SoldAggregateRow[],
    flashSaleSlot: FlashSaleSlotRow,
    breadcrumbs: BreadcrumbDto[],
    recommendations: RecommendationDto[],
  ) {
    const variantPrices = product.variants
      .map((variant) => this.toNumber(variant.price))
      .filter((price: number | null): price is number => price !== null)
    const effectivePrice =
      variantPrices.length > 0
        ? Math.min(...variantPrices)
        : (this.toNumber(product.basePrice) ?? 0)
    const soldCount = soldRows.reduce((sum, row) => sum + (row._sum.quantity ?? 0), 0)
    const reviewCount = reviewRow?._count.productId ?? 0
    const averageRating = reviewRow?._avg.rating ?? 0
    const defaultVariant = product.variants[0] ?? null
    const originalPrice = this.toNumber(flashSaleSlot?.originalPrice) ?? null
    const salePrice = this.toNumber(flashSaleSlot?.salePrice) ?? null
    const shipsFrom = [product.shop.city, product.shop.country].filter(Boolean).join(', ') || null
    const availableStock = defaultVariant
      ? Math.max(defaultVariant.stock - defaultVariant.reservedStock, 0)
      : Math.max(product.baseStock - product.reservedStock, 0)
    const quantityLimit = flashSaleSlot?.purchaseLimit ?? availableStock
    const quantityMax = availableStock > 0 ? Math.min(quantityLimit, availableStock) : 0

    return {
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.description,
        sku: defaultVariant?.sku ?? product.baseSku ?? null,
        price: salePrice ?? effectivePrice,
        originalPrice,
        discountPercent:
          originalPrice && salePrice
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : null,
        currency: 'VND',
        statusFlags: { isFlashSale: Boolean(flashSaleSlot) },
      },
      media: product.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt ?? null,
        isCover: image.isCover,
      })),
      breadcrumbs,
      rating: {
        averageRating,
        reviewCount,
        soldCount,
      },
      purchaseOptions: {
        defaultVariantId: defaultVariant?.id ?? null,
        quantity: {
          min: 1,
          max: quantityMax,
        },
        optionGroups: product.variantOptionGroups.map((group) => ({
          id: group.id,
          name: group.name,
          options: group.options.map((option) => ({ id: option.id, value: option.value })),
        })),
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku ?? null,
          price: this.toNumber(variant.price) ?? 0,
          stock: Math.max(variant.stock - variant.reservedStock, 0),
          optionValues: variant.optionValues.map((value) => ({
            groupId: value.option.group.id,
            groupName: value.option.group.name,
            optionId: value.option.id,
            optionValue: value.option.value,
          })),
        })),
      },
      shop: {
        id: product.shop.id,
        name: product.shop.name,
        slug: product.shop.slug,
        logo: product.shop.logo ?? null,
        shipsFrom,
        followerCount: 0,
        rating: averageRating,
        responseRate: null,
      },
      shippingReturns: {
        shipsFrom,
        returnWindowDays: null,
        authenticityLabel: 'Authentic',
      },
      specifications: [],
      recommendations,
    }
  }

  private toNumber(value: DecimalLike) {
    return value?.toNumber() ?? null
  }
}
