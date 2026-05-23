import { describe, expect, it, vi } from 'vitest'
import { CategoryPageService } from './category-page.service'

function createPrismaMock() {
  return {
    category: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
    },
    productVariant: {
      groupBy: vi.fn(),
    },
    review: {
      groupBy: vi.fn(),
    },
    productScore: {
      findMany: vi.fn(),
    },
    sellerOrderItem: {
      groupBy: vi.fn(),
    },
  }
}

describe('CategoryPageService', () => {
  it('returns descendant-aware category page payload with filters and pagination', async () => {
    const prisma = createPrismaMock()
    const service = new CategoryPageService(prisma as never)

    prisma.category.findFirst.mockResolvedValue({
      id: 'root',
      name: 'Electronics',
      slug: 'electronics',
      parentId: null,
      description: 'All electronics',
      banner: 'banner.jpg',
      metaTitle: 'Electronics',
      metaDesc: 'Shop electronics',
    })
    prisma.category.findMany
      .mockResolvedValueOnce([{ id: 'phones', parentId: 'root' }, { id: 'audio', parentId: 'root' }])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        { id: 'phones', name: 'Phones', slug: 'phones', parentId: 'root', sortOrder: 1 },
        { id: 'audio', name: 'Audio', slug: 'audio', parentId: 'root', sortOrder: 2 },
      ])
    prisma.category.findUnique
      .mockResolvedValueOnce({
        id: 'root',
        name: 'Electronics',
        slug: 'electronics',
        parentId: null,
      })
    prisma.product.findMany
      .mockResolvedValueOnce([
        {
          id: 'p1',
          name: 'Phone A',
          slug: 'phone-a',
          categoryId: 'phones',
          basePrice: '100',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: 'p2',
          name: 'Headphones B',
          slug: 'headphones-b',
          categoryId: 'audio',
          basePrice: null,
          createdAt: new Date('2026-01-03T00:00:00.000Z'),
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'p1',
          name: 'Phone A',
          slug: 'phone-a',
          description: 'Phone',
          basePrice: '100',
          hasVariants: false,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          shop: { id: 'shop-1', name: 'Shop 1', slug: 'shop-1' },
          category: { id: 'phones', name: 'Phones', slug: 'phones' },
          images: [{ url: 'phone.jpg', alt: 'Phone', isCover: true }],
          variants: [],
        },
      ])
    prisma.productVariant.groupBy.mockResolvedValue([{ productId: 'p2', _min: { price: '80' } }])
    prisma.review.groupBy.mockResolvedValue([
      { productId: 'p1', _avg: { rating: 4.5 }, _count: { productId: 2 } },
      { productId: 'p2', _avg: { rating: 3.2 }, _count: { productId: 1 } },
    ])
    prisma.productScore.findMany.mockResolvedValue([{ productId: 'p1', score: 10 }])
    prisma.sellerOrderItem.groupBy.mockResolvedValue([{ variantId: 'v1', _sum: { quantity: 12 } }])

    const result = await service.getCategoryPage('electronics', {
      page: 1,
      limit: 1,
      sort: 'popular',
      ratings: '4,5',
    })

    expect(result.category.slug).toBe('electronics')
    expect(result.breadcrumb).toEqual([{ id: 'root', name: 'Electronics', slug: 'electronics' }])
    expect(result.products.items).toHaveLength(1)
    expect(result.products.items[0]).toMatchObject({
      id: 'p1',
      slug: 'phone-a',
      price: 100,
      averageRating: 4.5,
      reviewCount: 2,
    })
    expect(result.products.meta).toMatchObject({
      total: 1,
      page: 1,
      limit: 1,
      totalPages: 1,
    })
    expect(result.filters.categories).toEqual([
      expect.objectContaining({ id: 'root', productCount: 2, isSelected: false }),
      expect.objectContaining({ id: 'phones', productCount: 1 }),
      expect.objectContaining({ id: 'audio', productCount: 1 }),
    ])
    expect(result.filters.priceRange).toEqual({
      min: 80,
      max: 100,
      selectedMin: null,
      selectedMax: null,
    })
    expect(result.filters.ratingBuckets).toEqual([
      expect.objectContaining({ rating: 5, count: 0 }),
      expect.objectContaining({ rating: 4, count: 1, isSelected: true }),
      expect.objectContaining({ rating: 3, count: 2, isSelected: false }),
    ])
  })
})
