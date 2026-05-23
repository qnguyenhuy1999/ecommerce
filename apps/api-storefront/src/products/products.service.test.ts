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
    category: { findUnique: vi.fn() },
  }
}

describe('ProductsService', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

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
        { id: 'img-cover', url: 'cover.jpg', alt: 'Cover', isCover: true, sortOrder: 0, createdAt: now },
        { id: 'img-2', url: 'detail-2.jpg', alt: 'Side', isCover: false, sortOrder: 1, createdAt: now },
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
          optionValues: [{ option: { id: 'opt-onyx', value: 'Onyx', group: { id: 'group-color', name: 'Color' } } }],
        },
        {
          id: 'var-2',
          sku: 'HP-SAND-S',
          price: decimal(89),
          stock: 80,
          reservedStock: 7,
          isActive: true,
          optionValues: [{ option: { id: 'opt-sand', value: 'Sand', group: { id: 'group-color', name: 'Color' } } }],
        },
      ],
    })
    prisma.category.findUnique
      .mockResolvedValueOnce({ id: 'cat-phones', name: 'Audio', slug: 'audio', parentId: 'cat-root' })
      .mockResolvedValueOnce({ id: 'cat-root', name: 'Electronics', slug: 'electronics', parentId: null })
    prisma.review.groupBy.mockResolvedValue([{ productId: 'prod-1', _avg: { rating: 4.4 }, _count: { productId: 1000 } }])
    prisma.sellerOrderItem.groupBy.mockResolvedValue([{ variantId: 'var-1', _sum: { quantity: 2200 } }])
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
})
