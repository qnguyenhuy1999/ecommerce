import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from '@ecom/database'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma'
import { ProductStatus, ReviewStatus } from '@ecom/contracts/enums'
import type { CategoryPageQueryDto } from './dto/category-page.dto'

type CategoryNode = {
  id: string
  name?: string
  slug?: string
  parentId: string | null
  sortOrder?: number
}

type CandidateProduct = {
  id: string
  name: string
  slug: string
  categoryId: string | null
  basePrice: unknown
  createdAt: Date
}

type ProductReviewAggregate = {
  productId: string
  _avg: { rating: number | null }
  _count: { productId: number }
}

type ReviewStats = {
  averageRating: number
  reviewCount: number
}

type DetailedProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: Date
  shop: { id: string; name: string; slug: string }
  category: { id: string; name: string; slug: string } | null
  images: Array<{ url: string; alt: string | null }>
  variants: Array<{ id: string; price: unknown }>
}

const SORT_OPTIONS = ['popular', 'newest', 'price-asc', 'price-desc'] as const

@Injectable()
export class CategoryPageService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoryPage(slug: string, query: CategoryPageQueryDto) {
    const category = await this.prisma.category.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        description: true,
        banner: true,
        metaTitle: true,
        metaDesc: true,
      },
    })

    if (!category) throw new NotFoundException('Category not found')

    const descendants = await this.getDescendantNodes(category.id)
    const treeNodes = [category, ...descendants]
    const descendantIds = treeNodes.map((node) => node.id)
    const treeByParent = this.groupByParent(treeNodes)

    const {
      breadcrumb,
      subcategories,
      candidateProducts,
      priceByProductId,
      reviewStatsByProductId,
    } = await this.loadCandidateData(category.id, descendantIds)

    const selectedCategoryIds = this.parseSelectedCategoryIds(query.categoryIds, descendantIds)
    const selectedSubtreeIds =
      selectedCategoryIds.length > 0
        ? [
            ...new Set(
              selectedCategoryIds.flatMap((id) => this.collectSubtreeIds(id, treeByParent)),
            ),
          ]
        : descendantIds

    const productsAfterCategoryAndPrice = candidateProducts.filter((product) => {
      if (!product.categoryId || !selectedSubtreeIds.includes(product.categoryId)) return false

      const price = priceByProductId.get(product.id) ?? null
      if (query.minPrice !== undefined && (price === null || price < query.minPrice)) return false
      if (query.maxPrice !== undefined && (price === null || price > query.maxPrice)) return false

      return true
    })

    const selectedMinRating = this.parseSelectedMinRating(query.ratings)
    const filteredProducts =
      selectedMinRating === null
        ? productsAfterCategoryAndPrice
        : productsAfterCategoryAndPrice.filter((product) => {
            const rating = reviewStatsByProductId.get(product.id)?.averageRating ?? 0
            return rating >= selectedMinRating
          })

    const popularityScores: Array<{ productId: string; score: unknown }> = filteredProducts.length
      ? await this.prisma.productScore.findMany({
          where: {
            productId: { in: filteredProducts.map((product) => product.id) },
            scoreType: 'POPULARITY',
          },
          select: { productId: true, score: true },
        })
      : []

    const popularityByProductId: Map<string, number> = new Map(
      popularityScores.map((row) => [row.productId, this.toNumber(row.score) ?? 0]),
    )

    const sortedProducts = [...filteredProducts].sort((left, right) =>
      this.compareProducts(
        left,
        right,
        query.sort ?? 'popular',
        priceByProductId,
        popularityByProductId,
      ),
    )

    const page = query.page ?? 1
    const limit = query.limit ?? 20
    const start = (page - 1) * limit
    const pagedProducts = sortedProducts.slice(start, start + limit)
    const pagedIds = pagedProducts.map((product) => product.id)

    const productCards = await this.fetchPagedProductCards(
      pagedIds,
      priceByProductId,
      reviewStatsByProductId,
      category,
    )

    const categoryCounts = this.buildCategoryFilterCounts(
      category,
      subcategories,
      candidateProducts,
      treeByParent,
    )

    const ratingBuckets = [5, 4, 3].map((rating) => ({
      rating,
      count: productsAfterCategoryAndPrice.filter((product) => {
        const averageRating = reviewStatsByProductId.get(product.id)?.averageRating ?? 0
        return averageRating >= rating
      }).length,
      isSelected: selectedMinRating === rating,
    }))

    const allPrices: number[] = candidateProducts
      .map((product) => priceByProductId.get(product.id) ?? null)
      .filter((price): price is number => price !== null)
    const products = buildOffsetResponse(productCards, page, limit, sortedProducts.length)

    return {
      category,
      breadcrumb,
      subcategories: subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        productCount:
          categoryCounts.find((entry) => entry.id === subcategory.id)?.productCount ?? 0,
        isSelected: selectedCategoryIds.includes(subcategory.id),
      })),
      filters: {
        categories: categoryCounts,
        priceRange: {
          min: allPrices.length ? Math.min(...allPrices) : null,
          max: allPrices.length ? Math.max(...allPrices) : null,
          selectedMin: query.minPrice ?? null,
          selectedMax: query.maxPrice ?? null,
        },
        ratingBuckets,
      },
      products,
      sort: {
        current: query.sort ?? 'popular',
        options: [...SORT_OPTIONS],
      },
    }
  }

  private async loadCandidateData(categoryId: string, descendantIds: string[]) {
    const [breadcrumb, subcategories, candidateProducts] = await Promise.all([
      this.getBreadcrumb(categoryId),
      this.prisma.category.findMany({
        where: { parentId: categoryId, isActive: true },
        select: { id: true, name: true, slug: true, parentId: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.product.findMany({
        where: {
          status: ProductStatus.PUBLISHED,
          deletedAt: null,
          categoryId: { in: descendantIds },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          categoryId: true,
          basePrice: true,
          createdAt: true,
        },
      }),
    ])

    const candidateIds = candidateProducts.map((product) => product.id)
    const [variantMinRows, reviewRows] = candidateIds.length
      ? await Promise.all([
          this.prisma.productVariant.groupBy({
            by: ['productId'],
            where: { productId: { in: candidateIds }, isActive: true },
            _min: { price: true },
          }),
          this.prisma.review.groupBy({
            by: ['productId'],
            where: { productId: { in: candidateIds }, status: ReviewStatus.APPROVED },
            _avg: { rating: true },
            _count: { productId: true },
          }),
        ])
      : [[], []]

    return {
      breadcrumb,
      subcategories,
      candidateProducts,
      priceByProductId: this.buildEffectivePriceMap(candidateProducts, variantMinRows),
      reviewStatsByProductId: this.buildReviewStatsMap(reviewRows),
    }
  }

  private async fetchPagedProductCards(
    pagedIds: string[],
    priceByProductId: Map<string, number | null>,
    reviewStatsByProductId: Map<string, ReviewStats>,
    category: { id: string; name: string; slug: string },
  ) {
    const detailedProducts: DetailedProduct[] = pagedIds.length
      ? await this.prisma.product.findMany({
          where: { id: { in: pagedIds } },
          include: {
            shop: { select: { id: true, name: true, slug: true } },
            category: { select: { id: true, name: true, slug: true } },
            images: { where: { isCover: true }, orderBy: { sortOrder: 'asc' }, take: 1 },
            variants: { where: { isActive: true }, select: { id: true, price: true } },
          },
        })
      : []

    const variantIds = detailedProducts.flatMap((product) =>
      product.variants.map((variant) => variant.id),
    )
    const soldCounts = variantIds.length
      ? await this.prisma.sellerOrderItem.groupBy({
          by: ['variantId'],
          where: { variantId: { in: variantIds } },
          _sum: { quantity: true },
        })
      : []

    const soldCountByVariantId: Map<string, number> = new Map(
      soldCounts.map((row) => [row.variantId, row._sum.quantity ?? 0]),
    )

    const detailedProductById = new Map(
      detailedProducts.map((product) => [product.id, product] as const),
    )
    return pagedIds
      .map((id) => detailedProductById.get(id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product))
      .map((product) => {
        const reviewStats = reviewStatsByProductId.get(product.id)
        const soldCount = product.variants.reduce(
          (sum, variant) => sum + (soldCountByVariantId.get(variant.id) ?? 0),
          0,
        )
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: priceByProductId.get(product.id) ?? 0,
          imageUrl: product.images[0]?.url ?? null,
          averageRating: reviewStats?.averageRating ?? 0,
          reviewCount: reviewStats?.reviewCount ?? 0,
          soldCount,
          createdAt: product.createdAt,
          category: {
            id: product.category?.id ?? category.id,
            name: product.category?.name ?? category.name,
            slug: product.category?.slug ?? category.slug,
          },
          shop: {
            id: product.shop.id,
            name: product.shop.name,
            slug: product.shop.slug,
          },
        }
      })
  }

  private async getDescendantNodes(rootId: string) {
    const descendants: CategoryNode[] = []
    let frontier = [rootId]

    while (frontier.length > 0) {
      const children = await this.prisma.category.findMany({
        where: { parentId: { in: frontier }, isActive: true },
        select: { id: true, parentId: true },
      })

      if (children.length === 0) break

      descendants.push(...children)
      frontier = children.map((child) => child.id)
    }

    return descendants
  }

  private async getBreadcrumb(categoryId: string) {
    const breadcrumb: { id: string; name: string; slug: string }[] = []
    let current = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true, name: true, slug: true, parentId: true },
    })

    while (current) {
      breadcrumb.unshift({ id: current.id, name: current.name, slug: current.slug })
      if (!current.parentId) break
      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
        select: { id: true, name: true, slug: true, parentId: true },
      })
    }

    return breadcrumb
  }

  private groupByParent(nodes: Array<{ id: string; parentId: string | null }>) {
    const grouped = new Map<string | null, string[]>()
    for (const node of nodes) {
      const siblings = grouped.get(node.parentId) ?? []
      siblings.push(node.id)
      grouped.set(node.parentId, siblings)
    }
    return grouped
  }

  private collectSubtreeIds(categoryId: string, treeByParent: Map<string | null, string[]>) {
    const ids = [categoryId]
    const queue = [categoryId]

    while (queue.length > 0) {
      const currentId = queue.shift()
      if (!currentId) continue
      const children = treeByParent.get(currentId) ?? []
      for (const childId of children) {
        ids.push(childId)
        queue.push(childId)
      }
    }

    return ids
  }

  private parseSelectedCategoryIds(categoryIds: string | undefined, allowedIds: string[]) {
    if (!categoryIds) return []
    const allowed = new Set(allowedIds)
    return [
      ...new Set(
        categoryIds
          .split(',')
          .map((value) => value.trim())
          .filter((value) => allowed.has(value)),
      ),
    ]
  }

  private parseSelectedMinRating(ratings: string | undefined) {
    if (!ratings) return null
    const parsed = ratings
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 5)

    return parsed.length > 0 ? Math.min(...parsed) : null
  }

  private buildEffectivePriceMap(
    products: CandidateProduct[],
    variantMinRows: Array<{ productId: string; _min: { price: unknown } }>,
  ): Map<string, number | null> {
    const variantMinByProductId: Map<string, number | null> = new Map(
      variantMinRows.map((row) => [row.productId, this.toNumber(row._min.price)]),
    )

    return new Map<string, number | null>(
      products.map((product) => {
        const basePrice = this.toNumber(product.basePrice)
        return [product.id, basePrice ?? variantMinByProductId.get(product.id) ?? null]
      }),
    )
  }

  private buildReviewStatsMap(reviewRows: ProductReviewAggregate[]): Map<string, ReviewStats> {
    return new Map<string, ReviewStats>(
      reviewRows.map((row) => [
        row.productId,
        {
          averageRating: Number((row._avg.rating ?? 0).toFixed(1)),
          reviewCount: row._count.productId,
        },
      ]),
    )
  }

  private buildCategoryFilterCounts(
    rootCategory: { id: string; name: string; slug: string },
    subcategories: Array<{ id: string; name: string; slug: string }>,
    products: CandidateProduct[],
    treeByParent: Map<string | null, string[]>,
  ) {
    const rootCount = products.filter((product) => product.categoryId !== null).length
    const counts = [
      {
        id: rootCategory.id,
        name: rootCategory.name,
        slug: rootCategory.slug,
        productCount: rootCount,
        isSelected: false,
      },
    ]

    for (const subcategory of subcategories) {
      const subtreeIds = new Set(this.collectSubtreeIds(subcategory.id, treeByParent))
      counts.push({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        productCount: products.filter(
          (product) => product.categoryId && subtreeIds.has(product.categoryId),
        ).length,
        isSelected: false,
      })
    }

    return counts
  }

  private compareProducts(
    left: CandidateProduct,
    right: CandidateProduct,
    sort: (typeof SORT_OPTIONS)[number],
    priceByProductId: Map<string, number | null>,
    popularityByProductId: Map<string, number>,
  ) {
    if (sort === 'price-asc' || sort === 'price-desc') {
      const leftPrice = priceByProductId.get(left.id) ?? Number.POSITIVE_INFINITY
      const rightPrice = priceByProductId.get(right.id) ?? Number.POSITIVE_INFINITY
      if (leftPrice !== rightPrice) {
        return sort === 'price-asc' ? leftPrice - rightPrice : rightPrice - leftPrice
      }
      return right.createdAt.getTime() - left.createdAt.getTime()
    }

    if (sort === 'newest') {
      return right.createdAt.getTime() - left.createdAt.getTime()
    }

    const leftPopularity = popularityByProductId.get(left.id) ?? 0
    const rightPopularity = popularityByProductId.get(right.id) ?? 0
    if (leftPopularity !== rightPopularity) return rightPopularity - leftPopularity
    return right.createdAt.getTime() - left.createdAt.getTime()
  }

  private toNumber(value: unknown): number | null {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return Number(value)
    if (
      value &&
      typeof value === 'object' &&
      'toNumber' in value &&
      typeof (value as { toNumber?: unknown }).toNumber === 'function'
    ) {
      const numberValue = (value as { toNumber: () => unknown }).toNumber()
      return typeof numberValue === 'number' ? numberValue : null
    }
    return null
  }

  async listCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        banner: true,
        description: true,
        sortOrder: true,
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            banner: true,
            description: true,
            sortOrder: true,
            children: {
              where: { isActive: true },
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                banner: true,
                description: true,
                sortOrder: true,
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })
  }
}
