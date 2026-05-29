import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProductsService } from './products.service'

function decimal(value: number) {
  return { toNumber: () => value }
}

function createPrismaMock() {
  return {
    product: { findFirst: vi.fn(), findMany: vi.fn() },
    review: { groupBy: vi.fn() },
    sellerOrderItem: { groupBy: vi.fn() },
    flashSaleSlot: { findFirst: vi.fn() },
    productScore: { findMany: vi.fn() },
    category: { findUnique: vi.fn() },
  }
}

type RecommendationFetchArgs = {
  where: {
    id?: { not?: string; in?: string[] }
    categoryId?: string
    status?: string
    deletedAt?: null
    productId?: { not?: string }
    scoreType?: string
  }
  take?: number
  orderBy?: { score: 'desc' }
}

// eslint-disable-next-line max-lines-per-function
describe('ProductsService', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  // eslint-disable-next-line max-lines-per-function
  it('returns product detail payload for published product slug', async () => {
    const prisma = createPrismaMock()
    const service = new ProductsService(prisma as never)
    const now = new Date('2026-05-23T10:00:00.000Z')

    vi.useFakeTimers()
    vi.setSystemTime(now)

    prisma.product.findFirst.mockResolvedValue({
      id: 'prod-1',
      shopId: 'shop-1',
      categoryId: 'cat-phones',
      name: 'Wireless ANC Headphones - Studio Edition',
      slug: 'wireless-anc-headphones-studio-edition',
      description: 'Full description',
      status: 'PUBLISHED',
      basePrice: decimal(129.6),
      baseSku: 'HP-BASE',
      baseStock: 200,
      reservedStock: 27,
      hasVariants: true,
      shop: {
        id: 'shop-1',
        name: 'Verdant Co.',
        slug: 'verdant-co',
        logo: 'shop-logo.jpg',
        city: 'Manila',
        country: 'PH',
      },
      category: { id: 'cat-phones', name: 'Audio', slug: 'audio', parentId: 'cat-root' },
      images: [
        {
          id: 'img-cover',
          url: 'cover.jpg',
          alt: 'Cover',
          isCover: true,
          sortOrder: 0,
          createdAt: now,
        },
        {
          id: 'img-2',
          url: 'detail-2.jpg',
          alt: 'Side',
          isCover: false,
          sortOrder: 1,
          createdAt: now,
        },
      ],
      variantOptionGroups: [
        {
          id: 'group-color',
          name: 'Color',
          sortOrder: 0,
          options: [
            { id: 'opt-onyx', value: 'Onyx', sortOrder: 0 },
            { id: 'opt-sand', value: 'Sand', sortOrder: 1 },
          ],
        },
      ],
      variants: [
        {
          id: 'var-1',
          sku: 'HP-ONYX-S',
          price: decimal(81),
          stock: 120,
          reservedStock: 20,
          isActive: true,
          optionValues: [
            {
              option: {
                id: 'opt-onyx',
                value: 'Onyx',
                group: { id: 'group-color', name: 'Color' },
              },
            },
          ],
        },
        {
          id: 'var-2',
          sku: 'HP-SAND-S',
          price: decimal(89),
          stock: 80,
          reservedStock: 7,
          isActive: true,
          optionValues: [
            {
              option: {
                id: 'opt-sand',
                value: 'Sand',
                group: { id: 'group-color', name: 'Color' },
              },
            },
          ],
        },
      ],
    })
    prisma.category.findUnique
      .mockResolvedValueOnce({
        id: 'cat-phones',
        name: 'Audio',
        slug: 'audio',
        parentId: 'cat-root',
      })
      .mockResolvedValueOnce({
        id: 'cat-root',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    prisma.review.groupBy.mockResolvedValue([
      { productId: 'prod-1', _avg: { rating: 4.4 }, _count: { productId: 1000 } },
    ])
    prisma.sellerOrderItem.groupBy.mockResolvedValue([
      { variantId: 'var-1', _sum: { quantity: 2200 } },
    ])
    prisma.flashSaleSlot.findFirst.mockResolvedValue({
      originalPrice: decimal(129.6),
      salePrice: decimal(81),
      purchaseLimit: 5,
    })
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'prod-2',
        name: 'Travel Backpack 24L Water-Resistant',
        slug: 'travel-backpack-24l',
        shopId: 'shop-2',
        basePrice: decimal(113),
        images: [{ url: 'rec-1.jpg' }],
        shop: { id: 'shop-2', name: 'Road Co.', slug: 'road-co', logo: null },
        _count: { reviews: 3 },
        reviews: [{ rating: 5 }, { rating: 4 }, { rating: 4 }],
        variants: [],
      },
    ])
    const result = await service.getProductDetail('wireless-anc-headphones-studio-edition')

    expect(result.product).toMatchObject({
      id: 'prod-1',
      slug: 'wireless-anc-headphones-studio-edition',
      price: 81,
      originalPrice: 129.6,
      discountPercent: 38,
      currency: 'VND',
    })
    expect(result.media).toEqual([
      expect.objectContaining({ id: 'img-cover', url: 'cover.jpg', isCover: true }),
      expect.objectContaining({ id: 'img-2', url: 'detail-2.jpg', isCover: false }),
    ])
    expect(result.breadcrumbs).toEqual([
      { id: 'cat-root', name: 'Electronics', slug: 'electronics' },
      { id: 'cat-phones', name: 'Audio', slug: 'audio' },
    ])
    expect(result.rating).toEqual({
      averageRating: 4.4,
      reviewCount: 1000,
      soldCount: 2200,
    })
    expect(result.purchaseOptions.defaultVariantId).toBe('var-1')
    expect(result.purchaseOptions.quantity.max).toBe(5)
    expect(result.shop).toMatchObject({
      id: 'shop-1',
      name: 'Verdant Co.',
      shipsFrom: 'Manila, PH',
    })
    expect(result.recommendations).toHaveLength(1)
  })

  it('throws when product slug is missing or unpublished', async () => {
    const prisma = createPrismaMock()
    const service = new ProductsService(prisma as never)

    prisma.product.findFirst.mockResolvedValue(null)

    await expect(service.getProductDetail('missing-product')).rejects.toThrow('Product not found')
  })

  it('excludes current product from recommendations and falls back to score query when needed', async () => {
    const prisma = createPrismaMock()
    const service = new ProductsService(prisma as never)

    prisma.product.findFirst.mockResolvedValue({
      id: 'prod-1',
      shopId: 'shop-1',
      categoryId: null,
      name: 'Headphones',
      slug: 'headphones',
      description: null,
      status: 'PUBLISHED',
      basePrice: decimal(99),
      baseSku: null,
      baseStock: 10,
      reservedStock: 0,
      hasVariants: false,
      shop: { id: 'shop-1', name: 'Shop 1', slug: 'shop-1', logo: null, city: null, country: null },
      category: null,
      images: [],
      variantOptionGroups: [],
      variants: [],
    })
    prisma.review.groupBy.mockResolvedValue([])
    prisma.sellerOrderItem.groupBy.mockResolvedValue([])
    prisma.flashSaleSlot.findFirst.mockResolvedValue(null)
    prisma.product.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: 'prod-9',
        name: 'Fallback Product',
        slug: 'fallback-product',
        shopId: 'shop-2',
        basePrice: decimal(49),
        images: [],
        shop: { id: 'shop-2', name: 'Shop 2', slug: 'shop-2', logo: null },
        _count: { reviews: 0 },
        reviews: [],
        variants: [],
      },
    ])
    prisma.productScore.findMany.mockResolvedValue([{ productId: 'prod-9', score: 9.8 }])

    const result = await service.getProductDetail('headphones')
    const firstRecommendationFetch = prisma.product.findMany.mock.calls[0]?.[0] as
      | RecommendationFetchArgs
      | undefined
    const fallbackScoreFetch = prisma.productScore.findMany.mock.calls[0]?.[0] as
      | RecommendationFetchArgs
      | undefined
    const secondRecommendationFetch = prisma.product.findMany.mock.calls[1]?.[0] as
      | RecommendationFetchArgs
      | undefined
    const firstRecommendationCallOrder = prisma.product.findMany.mock.invocationCallOrder[0] ?? -1
    const fallbackScoreCallOrder = prisma.productScore.findMany.mock.invocationCallOrder[0] ?? -1
    const secondRecommendationCallOrder = prisma.product.findMany.mock.invocationCallOrder[1] ?? -1

    expect(result.recommendations).toEqual([
      expect.objectContaining({ id: 'prod-9', slug: 'fallback-product' }),
    ])
    expect(
      result.recommendations.find((item: { id: string }) => item.id === 'prod-1'),
    ).toBeUndefined()
    expect(prisma.product.findMany).toHaveBeenCalledTimes(2)
    expect(prisma.productScore.findMany).toHaveBeenCalledTimes(1)
    expect(firstRecommendationFetch).toMatchObject({
      where: {
        id: { not: 'prod-1' },
        status: 'PUBLISHED',
        deletedAt: null,
      },
      take: 6,
    })
    expect(firstRecommendationFetch?.where).not.toHaveProperty('categoryId')
    expect(fallbackScoreFetch).toMatchObject({
      where: {
        productId: { not: 'prod-1' },
        scoreType: 'POPULARITY',
      },
      orderBy: { score: 'desc' },
    })
    expect(secondRecommendationFetch).toMatchObject({
      where: {
        id: { in: ['prod-9'], not: 'prod-1' },
        status: 'PUBLISHED',
        deletedAt: null,
      },
    })
    expect(firstRecommendationCallOrder).toBeGreaterThan(-1)
    expect(fallbackScoreCallOrder).toBeGreaterThan(-1)
    expect(secondRecommendationCallOrder).toBeGreaterThan(-1)
    expect(firstRecommendationCallOrder).toBeLessThan(fallbackScoreCallOrder)
    expect(fallbackScoreCallOrder).toBeLessThan(secondRecommendationCallOrder)
  })
})
