import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProductsService } from './products.service'

function decimal(value: number) {
  return { toNumber: () => value }
}

function createProductsRepositoryMock() {
  return {
    findProductBySlug: vi.fn(),
    aggregateReviews: vi.fn(),
    aggregateSoldItems: vi.fn(),
    findActiveFlashSaleSlot: vi.fn(),
    findCategory: vi.fn(),
    findProductScores: vi.fn(),
    findRecommendationProducts: vi.fn(),
  }
}

type RecommendationFetchArgs = {
  id?: { not?: string; in?: string[] }
  categoryId?: string
  status?: string
  deletedAt?: null
}

// eslint-disable-next-line max-lines-per-function
describe('ProductsService', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  // eslint-disable-next-line max-lines-per-function
  it('returns product detail payload for published product slug', async () => {
    const productsRepository = createProductsRepositoryMock()
    const service = new ProductsService(productsRepository as never)
    const now = new Date('2026-05-23T10:00:00.000Z')

    vi.useFakeTimers()
    vi.setSystemTime(now)

    productsRepository.findProductBySlug.mockResolvedValue({
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
    productsRepository.findCategory
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
    productsRepository.aggregateReviews.mockResolvedValue([
      { productId: 'prod-1', _avg: { rating: 4.4 }, _count: { productId: 1000 } },
    ])
    productsRepository.aggregateSoldItems.mockResolvedValue([
      { variantId: 'var-1', _sum: { quantity: 2200 } },
    ])
    productsRepository.findActiveFlashSaleSlot.mockResolvedValue({
      originalPrice: decimal(129.6),
      salePrice: decimal(81),
      purchaseLimit: 5,
    })
    productsRepository.findRecommendationProducts.mockResolvedValue([
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
    productsRepository.findProductScores.mockResolvedValue([])
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
    const productsRepository = createProductsRepositoryMock()
    const service = new ProductsService(productsRepository as never)

    productsRepository.findProductBySlug.mockResolvedValue(null)

    await expect(service.getProductDetail('missing-product')).rejects.toThrow('Product not found')
  })

  it('excludes current product from recommendations and falls back to score query when needed', async () => {
    const productsRepository = createProductsRepositoryMock()
    const service = new ProductsService(productsRepository as never)

    productsRepository.findProductBySlug.mockResolvedValue({
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
    productsRepository.aggregateReviews.mockResolvedValue([])
    productsRepository.aggregateSoldItems.mockResolvedValue([])
    productsRepository.findActiveFlashSaleSlot.mockResolvedValue(null)
    productsRepository.findRecommendationProducts.mockResolvedValueOnce([]).mockResolvedValueOnce([
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
    productsRepository.findProductScores.mockResolvedValue([{ productId: 'prod-9', score: 9.8 }])

    const result = await service.getProductDetail('headphones')
    const firstRecommendationFetch = productsRepository.findRecommendationProducts.mock
      .calls[0]?.[0] as RecommendationFetchArgs | undefined
    const fallbackScoreFetch = productsRepository.findProductScores.mock.calls[0]?.[0] as
      | string
      | undefined
    const secondRecommendationFetch = productsRepository.findRecommendationProducts.mock
      .calls[1]?.[0] as RecommendationFetchArgs | undefined
    const firstRecommendationCallOrder =
      productsRepository.findRecommendationProducts.mock.invocationCallOrder[0] ?? -1
    const fallbackScoreCallOrder =
      productsRepository.findProductScores.mock.invocationCallOrder[0] ?? -1
    const secondRecommendationCallOrder =
      productsRepository.findRecommendationProducts.mock.invocationCallOrder[1] ?? -1

    expect(result.recommendations).toEqual([
      expect.objectContaining({ id: 'prod-9', slug: 'fallback-product' }),
    ])
    expect(
      result.recommendations.find((item: { id: string }) => item.id === 'prod-1'),
    ).toBeUndefined()
    expect(productsRepository.findRecommendationProducts).toHaveBeenCalledTimes(2)
    expect(productsRepository.findProductScores).toHaveBeenCalledTimes(1)
    expect(firstRecommendationFetch).toMatchObject({
      id: { not: 'prod-1' },
      status: 'PUBLISHED',
      deletedAt: null,
    })
    expect(productsRepository.findRecommendationProducts.mock.calls[0]?.[1]).toBe(6)
    expect(firstRecommendationFetch).not.toHaveProperty('categoryId')
    expect(fallbackScoreFetch).toBe('prod-1')
    expect(secondRecommendationFetch).toMatchObject({
      id: { in: ['prod-9'], not: 'prod-1' },
      status: 'PUBLISHED',
      deletedAt: null,
    })
    expect(productsRepository.findRecommendationProducts.mock.calls[1]?.[1]).toBe(12)
    expect(firstRecommendationCallOrder).toBeGreaterThan(-1)
    expect(fallbackScoreCallOrder).toBeGreaterThan(-1)
    expect(secondRecommendationCallOrder).toBeGreaterThan(-1)
    expect(firstRecommendationCallOrder).toBeLessThan(fallbackScoreCallOrder)
    expect(fallbackScoreCallOrder).toBeLessThan(secondRecommendationCallOrder)
  })
})
