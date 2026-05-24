import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { FlashSaleStatus, PlatformVoucherStatus } from '@ecom/contracts/enums'
import type {
  CategoryDto,
  FeaturedSectionDto,
  FlashSaleDto,
  FlashSaleProductDto,
  HomepageDto,
  ProductCardDto,
  TrendingShopDto,
  PlatformVoucherDto,
} from './dto/homepage.dto'

const PRODUCT_WITH_RATING_INCLUDE = {
  images: { where: { isCover: true }, take: 1, select: { url: true } },
  shop: { select: { id: true, name: true, slug: true, logo: true } },
  _count: { select: { reviews: true } },
  reviews: { where: { status: 'APPROVED' as const }, select: { rating: true } },
  variants: {
    where: { isActive: true },
    select: { price: true },
    orderBy: { price: 'asc' as const },
    take: 1,
  },
} as const

type ProductWithRating = {
  id: string
  name: string
  slug: string
  shopId: string
  basePrice: { toNumber(): number } | null
  baseStock: number
  reservedStock: number
  createdAt: Date
  images: { url: string }[]
  shop: { id: string; name: string; slug: string; logo: string | null }
  _count: { reviews: number }
  reviews: { rating: number }[]
  variants: { price: { toNumber(): number } }[]
}

function toProductCard(p: ProductWithRating, isFlash = false, isNew = false): ProductCardDto {
  const price = p.variants[0]?.price.toNumber() ?? p.basePrice?.toNumber() ?? 0
  const stockLeft = p.baseStock - p.reservedStock
  const totalReviews = p.reviews.length
  const rating =
    totalReviews > 0
      ? Math.round((p.reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
      : null

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    shopId: p.shopId,
    price,
    originalPrice: null,
    discountPercent: null,
    coverImage: p.images[0]?.url ?? null,
    rating,
    reviewCount: p._count.reviews,
    shop: { id: p.shop.id, name: p.shop.name, slug: p.shop.slug, logo: p.shop.logo },
    isFlash,
    isNew,
    stockLeft: stockLeft <= 10 && stockLeft > 0 ? stockLeft : null,
  }
}

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepage(): Promise<HomepageDto> {
    const now = new Date()

    const [
      categories,
      vouchers,
      flashSale,
      featuredSections,
      trendingShops,
      recommendedProducts,
      newArrivals,
    ] = await Promise.all([
      this.getCategories(),
      this.getVouchers(now),
      this.getFlashSale(now),
      this.getFeaturedSections(),
      this.getTrendingShops(),
      this.getRecommendedProducts(),
      this.getNewArrivals(now),
    ])

    return {
      categories,
      vouchers,
      flashSale,
      featuredSections,
      trendingShops,
      recommendedProducts,
      newArrivals,
    }
  }

  private async getCategories(): Promise<CategoryDto[]> {
    const rows = await this.prisma.category.findMany({
      where: { parentId: null, isActive: true },
      select: { id: true, name: true, slug: true, icon: true },
      orderBy: { sortOrder: 'asc' },
    })
    return rows
  }

  private async getVouchers(now: Date): Promise<PlatformVoucherDto[]> {
    const rows = await this.prisma.platformVoucher.findMany({
      where: {
        status: PlatformVoucherStatus.ACTIVE,
        startsAt: { lte: now },
        expiresAt: { gte: now },
      },
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        discountValue: true,
        maxDiscountAmount: true,
        minOrderAmount: true,
        expiresAt: true,
      },
      orderBy: { discountValue: 'desc' },
      take: 8,
    })

    return rows.map((v) => ({
      id: v.id,
      code: v.code,
      name: v.name,
      type: v.type,
      discountValue: v.discountValue.toNumber(),
      maxDiscountAmount: v.maxDiscountAmount?.toNumber() ?? null,
      minOrderAmount: v.minOrderAmount?.toNumber() ?? null,
      expiresAt: v.expiresAt,
    }))
  }

  private async getFlashSale(now: Date): Promise<FlashSaleDto | null> {
    const campaign = await this.prisma.flashSaleCampaign.findFirst({
      where: {
        status: FlashSaleStatus.ACTIVE,
        isVisible: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { startsAt: 'desc' },
    })

    if (!campaign) return null

    const slots = await this.prisma.flashSaleSlot.findMany({
      where: { campaignId: campaign.id, status: 'APPROVED' },
      include: {
        product: {
          include: {
            images: { where: { isCover: true }, take: 1, select: { url: true } },
            shop: { select: { id: true, name: true, slug: true, logo: true } },
            _count: { select: { reviews: true } },
            reviews: { where: { status: 'APPROVED' }, select: { rating: true } },
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { soldCount: 'desc' }],
      take: 8,
    })

    const products: FlashSaleProductDto[] = slots.map((slot) => {
      const p = slot.product
      const totalReviews = p.reviews.length
      const rating =
        totalReviews > 0
          ? Math.round((p.reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10
          : null
      const salePrice = slot.salePrice.toNumber()
      const originalPrice = slot.originalPrice.toNumber()
      const discountPercent = Math.round(((originalPrice - salePrice) / originalPrice) * 100)

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        shopId: p.shopId,
        salePrice,
        originalPrice,
        discountPercent,
        totalStock: slot.totalStock,
        soldCount: slot.soldCount,
        stockLeft: slot.totalStock - slot.soldCount,
        coverImage: p.images[0]?.url ?? null,
        rating,
        reviewCount: p._count.reviews,
        shop: { id: p.shop.id, name: p.shop.name, slug: p.shop.slug, logo: p.shop.logo },
      }
    })

    return { id: campaign.id, name: campaign.name, endsAt: campaign.endsAt, products }
  }

  private async getFeaturedSections(): Promise<FeaturedSectionDto[]> {
    const topCategories = await this.prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
        products: { some: { status: 'PUBLISHED', deletedAt: null } },
      },
      select: { id: true, name: true, slug: true, _count: { select: { products: true } } },
      orderBy: { products: { _count: 'desc' } },
      take: 4,
    })

    if (topCategories.length === 0) return []

    const categoryIds = topCategories.map((c) => c.id)
    const products = await this.prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: PRODUCT_WITH_RATING_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: categoryIds.length * 6,
    })

    const byCategory = new Map<string, typeof products>()
    for (const p of products) {
      if (!p.categoryId) continue
      const arr = byCategory.get(p.categoryId) ?? []
      if (arr.length < 6) {
        arr.push(p)
        byCategory.set(p.categoryId, arr)
      }
    }

    return topCategories
      .filter((c) => (byCategory.get(c.id)?.length ?? 0) > 0)
      .map((c) => ({
        title: c.name,
        categorySlug: c.slug,
        categoryId: c.id,
        products: (byCategory.get(c.id) ?? []).map((p) => toProductCard(p)),
      }))
  }

  private async getTrendingShops(): Promise<TrendingShopDto[]> {
    const shops = await this.prisma.shop.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        banner: true,
        _count: { select: { sellerOrders: true } },
      },
      orderBy: { sellerOrders: { _count: 'desc' } },
      take: 4,
    })

    return shops.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      logo: s.logo,
      banner: s.banner,
    }))
  }

  private async getRecommendedProducts(): Promise<ProductCardDto[]> {
    const scores = await this.prisma.productScore.findMany({
      where: { scoreType: 'TRENDING' },
      orderBy: { score: 'desc' },
      take: 12,
      select: { productId: true },
    })

    if (scores.length === 0) return []

    const productIds = scores.map((s) => s.productId)
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, status: 'PUBLISHED', deletedAt: null },
      include: PRODUCT_WITH_RATING_INCLUDE,
    })

    const ordered = productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is (typeof products)[number] => p !== undefined)

    return ordered.map((p) => toProductCard(p, false, false))
  }

  private async getNewArrivals(now: Date): Promise<ProductCardDto[]> {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const products = await this.prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        createdAt: { gte: thirtyDaysAgo },
      },
      include: PRODUCT_WITH_RATING_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: 12,
    })

    return products.map((p) => toProductCard(p, false, true))
  }
}
