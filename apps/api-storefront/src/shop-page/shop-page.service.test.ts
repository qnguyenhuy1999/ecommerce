import { describe, expect, it, vi } from 'vitest'
import { NotFoundException } from '@nestjs/common'
import { ShopPageService } from './shop-page.service'

function createPrismaMock() {
  return {
    shop: {
      findFirst: vi.fn(),
    },
    product: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    coupon: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    review: {
      groupBy: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    sellerOrderItem: {
      groupBy: vi.fn(),
    },
    sellerMetricSnapshot: {
      findFirst: vi.fn(),
    },
    productScore: {
      findMany: vi.fn(),
    },
  }
}

describe('ShopPageService', () => {
  it('throws when shop slug does not exist', async () => {
    const prisma = createPrismaMock()
    prisma.shop.findFirst.mockResolvedValue(null)

    const service = new ShopPageService(prisma as never)

    await expect(service.getShopPage('missing')).rejects.toBeInstanceOf(NotFoundException)
  })

  it('throws when shop is inactive', async () => {
    const prisma = createPrismaMock()
    prisma.shop.findFirst.mockResolvedValue(null)

    const service = new ShopPageService(prisma as never)

    await expect(service.getShopProducts('inactive', { page: 1, limit: 20, sort: 'popular' })).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })

  it('returns shop page bootstrap payload with null followers and zero response fallback', async () => {
    const prisma = createPrismaMock()
    const service = new ShopPageService(prisma as never)

    prisma.shop.findFirst.mockResolvedValue({
      id: 'shop-1',
      name: 'Verdant Co.',
      slug: 'verdant-co',
      description: 'Plants',
      logo: 'logo.jpg',
      banner: 'banner.jpg',
      phone: null,
      email: null,
      city: 'Manila',
      state: null,
      country: 'PH',
      createdAt: new Date('2024-01-15T00:00:00.000Z'),
    })
    prisma.product.count.mockResolvedValue(2)
    prisma.coupon.count.mockResolvedValue(1)
    prisma.review.count.mockResolvedValue(3)
    prisma.sellerMetricSnapshot.findFirst.mockResolvedValue(null)
    prisma.coupon.findMany.mockResolvedValue([
      {
        id: 'c1',
        code: 'WELCOME10',
        name: '$10 Off',
        description: null,
        type: 'FIXED_AMOUNT',
        discountValue: '10',
        maxDiscountAmount: null,
        minOrderAmount: '40',
        expiresAt: new Date('2026-06-01T00:00:00.000Z'),
      },
    ])
    prisma.review.groupBy
      .mockResolvedValueOnce([
        { rating: 5, _count: { rating: 2 } },
        { rating: 4, _count: { rating: 1 } },
      ])
      .mockResolvedValueOnce([
        { productId: 'p1', _avg: { rating: 5 }, _count: { productId: 2 } },
        { productId: 'p2', _avg: { rating: 4 }, _count: { productId: 1 } },
      ])
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'p1',
        shopId: 'shop-1',
        name: 'Monstera',
        slug: 'monstera',
        description: 'Leaf',
        basePrice: '20',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        images: [{ url: 'cover-1.jpg', alt: 'Monstera' }],
        shop: { id: 'shop-1', name: 'Verdant Co.', slug: 'verdant-co', logo: 'logo.jpg' },
        category: null,
        variants: [{ id: 'v1', price: '20' }],
      },
      {
        id: 'p2',
        shopId: 'shop-1',
        name: 'Snake Plant',
        slug: 'snake-plant',
        description: 'Plant',
        basePrice: '18',
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
        images: [{ url: 'cover-2.jpg', alt: 'Snake plant' }],
        shop: { id: 'shop-1', name: 'Verdant Co.', slug: 'verdant-co', logo: 'logo.jpg' },
        category: null,
        variants: [{ id: 'v2', price: '18' }],
      },
    ])
    prisma.sellerOrderItem.groupBy.mockResolvedValue([
      { variantId: 'v1', _sum: { quantity: 9 } },
      { variantId: 'v2', _sum: { quantity: 4 } },
    ])
    prisma.productScore.findMany.mockResolvedValue([{ productId: 'p1', score: '99' }])

    const result = await service.getShopPage('verdant-co')

    expect(result.social.followersCount).toBeNull()
    expect(result.stats.responseRate).toBe(0)
    expect(result.stats.averageRating).toBe(4.7)
    expect(result.bestSellers[0]).toMatchObject({ id: 'p1', soldCount: 9 })
    expect(result.tabs).toEqual({ home: true, products: 2, vouchers: 1, reviews: 3 })
    expect(result.productsPreview.items).toHaveLength(2)
  })

  it('returns paginated products with sort and rating filters', async () => {
    const prisma = createPrismaMock()
    const service = new ShopPageService(prisma as never)

    prisma.shop.findFirst.mockResolvedValue({
      id: 'shop-1',
      name: 'Verdant Co.',
      slug: 'verdant-co',
      description: null,
      logo: null,
      banner: null,
      phone: null,
      email: null,
      city: 'Manila',
      state: null,
      country: 'PH',
      createdAt: new Date('2024-01-15T00:00:00.000Z'),
    })
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'p1',
        shopId: 'shop-1',
        name: 'A',
        slug: 'a',
        description: null,
        basePrice: '10',
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        images: [{ url: 'a.jpg', alt: null }],
        shop: { id: 'shop-1', name: 'Verdant Co.', slug: 'verdant-co', logo: null },
        category: null,
        variants: [{ id: 'v1', price: '10' }],
      },
      {
        id: 'p2',
        shopId: 'shop-1',
        name: 'B',
        slug: 'b',
        description: null,
        basePrice: '20',
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
        images: [{ url: 'b.jpg', alt: null }],
        shop: { id: 'shop-1', name: 'Verdant Co.', slug: 'verdant-co', logo: null },
        category: null,
        variants: [{ id: 'v2', price: '20' }],
      },
    ])
    prisma.review.groupBy.mockResolvedValue([
      { productId: 'p1', _avg: { rating: 5 }, _count: { productId: 4 } },
      { productId: 'p2', _avg: { rating: 3 }, _count: { productId: 2 } },
    ])
    prisma.sellerOrderItem.groupBy.mockResolvedValue([
      { variantId: 'v1', _sum: { quantity: 7 } },
      { variantId: 'v2', _sum: { quantity: 1 } },
    ])
    prisma.productScore.findMany.mockResolvedValue([{ productId: 'p1', score: '10' }, { productId: 'p2', score: '2' }])

    const result = await service.getShopProducts('verdant-co', {
      page: 1,
      limit: 1,
      sort: 'price-desc',
      ratings: '4,5',
    })

    expect(result.products.items).toHaveLength(1)
    expect(result.products.items[0]).toMatchObject({ id: 'p1', price: 10, averageRating: 5 })
    expect(result.products.meta.total).toBe(1)
    expect(result.filters.priceRange).toEqual({
      min: 10,
      max: 20,
      selectedMin: null,
      selectedMax: null,
    })
  })

  it('returns reviews filtered by rating and media flag', async () => {
    const prisma = createPrismaMock()
    const service = new ShopPageService(prisma as never)

    prisma.shop.findFirst.mockResolvedValue({
      id: 'shop-1',
      name: 'Verdant Co.',
      slug: 'verdant-co',
      description: null,
      logo: null,
      banner: null,
      phone: null,
      email: null,
      city: 'Manila',
      state: null,
      country: 'PH',
      createdAt: new Date('2024-01-15T00:00:00.000Z'),
    })
    prisma.review.groupBy.mockResolvedValue([
      { rating: 5, _count: { rating: 1 } },
      { rating: 4, _count: { rating: 1 } },
    ])
    prisma.review.count.mockResolvedValue(2)
    prisma.review.findMany.mockResolvedValue([
      {
        id: 'r1',
        rating: 5,
        title: 'Great',
        comment: 'Loved it',
        createdAt: new Date('2026-01-05T00:00:00.000Z'),
        buyer: { firstName: 'Ada', lastName: 'L', email: 'ada@example.com' },
        product: { id: 'p1', name: 'Monstera', slug: 'monstera' },
        images: [{ id: 'img-1', url: 'img.jpg', sortOrder: 0 }],
        replies: [{ id: 'reply-1', message: 'Thanks', createdAt: new Date('2026-01-06T00:00:00.000Z') }],
      },
    ])

    const result = await service.getShopReviews('verdant-co', {
      page: 1,
      limit: 20,
      rating: 5,
      withMedia: true,
    })

    expect(result.summary.averageRating).toBe(4.5)
    expect(result.summary.ratingBreakdown).toEqual([
      { rating: 5, count: 1 },
      { rating: 4, count: 1 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ])
    expect(result.reviews.items).toHaveLength(1)
    expect(result.reviews.items[0]).toMatchObject({
      id: 'r1',
      buyer: { displayName: 'Ada L' },
      reply: { message: 'Thanks' },
    })
  })
})
