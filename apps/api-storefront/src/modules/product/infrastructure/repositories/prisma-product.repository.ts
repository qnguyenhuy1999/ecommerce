import { Inject, Injectable } from '@nestjs/common'
import { $Enums, Prisma, PrismaClient } from '@prisma/client'

import {
  ProductEntity,
  type ProductProps,
  type ProductStatus,
  type ProductVariantSnapshot,
} from '../../domain/entities/product.entity'
import type {
  IProductRepository,
  ProductCreateInput,
  ProductListOptions,
  ProductListResult,
  ProductUpdateInput,
} from '../../domain/ports/product.repository.port'

const LIST_SELECT = {
  id: true,
  sellerId: true,
  sku: true,
  name: true,
  description: true,
  price: true,
  status: true,
  categoryId: true,
  images: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  seller: { select: { id: true, storeName: true, rating: true } },
  _count: { select: { variants: true } },
} satisfies Prisma.ProductSelect

const DETAIL_INCLUDE = {
  seller: { select: { id: true, userId: true, storeName: true, rating: true } },
  variants: {
    select: {
      id: true,
      sku: true,
      attributes: true,
      priceOverride: true,
      stock: true,
      reservedStock: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} satisfies Prisma.ProductInclude

const OWNER_SELECT = {
  id: true,
  sellerId: true,
  sku: true,
  name: true,
  description: true,
  price: true,
  status: true,
  categoryId: true,
  images: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  seller: { select: { id: true, userId: true, storeName: true, rating: true } },
} satisfies Prisma.ProductSelect

type ListRow = Prisma.ProductGetPayload<{ select: typeof LIST_SELECT }>
type DetailRow = Prisma.ProductGetPayload<{ include: typeof DETAIL_INCLUDE }>
type OwnerRow = Prisma.ProductGetPayload<{ select: typeof OWNER_SELECT }>

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async list(options: ProductListOptions): Promise<ProductListResult> {
    const where = this.buildWhere(options)
    const { page, limit, sort, order } = options

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        select: LIST_SELECT,
      }),
      this.prisma.product.count({ where }),
    ])

    return { data: rows.map((row) => this.listRowToEntity(row)), total }
  }

  async findByIdWithDetails(
    id: string,
    options: { excludeStatus?: ProductStatus | ProductStatus[] },
  ): Promise<ProductEntity | null> {
    const where: Prisma.ProductWhereInput = { id, deletedAt: null }
    this.applyExcludeStatus(where, options.excludeStatus)
    const row = await this.prisma.product.findFirst({ where, include: DETAIL_INCLUDE })
    return row ? this.detailRowToEntity(row) : null
  }

  async findForOwnerCheck(id: string): Promise<ProductEntity | null> {
    const row = await this.prisma.product.findUnique({ where: { id }, select: OWNER_SELECT })
    return row ? this.ownerRowToEntity(row) : null
  }

  async findBySellerAndSku(sellerId: string, sku: string): Promise<ProductEntity | null> {
    const row = await this.prisma.product.findUnique({
      where: { sellerId_sku: { sellerId, sku } },
      select: OWNER_SELECT,
    })
    return row ? this.ownerRowToEntity(row) : null
  }

  async listVariants(
    productId: string,
    options: { excludeStatus?: ProductStatus | ProductStatus[] },
  ): Promise<ProductVariantSnapshot[] | null> {
    const where: Prisma.ProductWhereInput = { id: productId, deletedAt: null }
    this.applyExcludeStatus(where, options.excludeStatus)

    const product = await this.prisma.product.findFirst({ where, select: { id: true } })
    if (!product) return null

    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        sku: true,
        attributes: true,
        priceOverride: true,
        stock: true,
        reservedStock: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return variants.map((v) => this.toVariantSnapshot(v))
  }

  async create(input: ProductCreateInput): Promise<ProductEntity> {
    const row = await this.prisma.product.create({
      data: {
        sellerId: input.sellerId,
        sku: input.sku,
        name: input.name,
        description: input.description,
        price: input.price,
        status: input.status as $Enums.ProductStatus,
        categoryId: input.categoryId,
        images: input.images,
        variants: {
          create: input.variants.map((variant) => ({
            sku: variant.sku,
            attributes: variant.attributes as Prisma.InputJsonValue,
            priceOverride: variant.priceOverride,
            stock: variant.stock ?? 0,
          })),
        },
      },
      include: DETAIL_INCLUDE,
    })
    return this.detailRowToEntity(row)
  }

  async update(id: string, input: ProductUpdateInput): Promise<ProductEntity> {
    const data: Prisma.ProductUpdateInput = {}
    if (input.sku !== undefined) data.sku = input.sku
    if (input.name !== undefined) data.name = input.name
    if (input.description !== undefined) data.description = input.description
    if (input.price !== undefined) data.price = input.price
    if (input.status !== undefined) data.status = input.status as $Enums.ProductStatus
    if (input.categoryId !== undefined) data.categoryId = input.categoryId
    if (input.images !== undefined) data.images = input.images

    const row = await this.prisma.product.update({ where: { id }, data, include: DETAIL_INCLUDE })
    return this.detailRowToEntity(row)
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { status: 'DELETED' as $Enums.ProductStatus, deletedAt: new Date() },
    })
  }

  private buildWhere(options: ProductListOptions): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {}
    if (options.notDeleted !== false) where.deletedAt = null
    this.applyIncludeStatus(where, options.status)
    this.applyExcludeStatus(where, options.excludeStatus)
    if (options.categoryId) where.categoryId = options.categoryId
    if (options.sellerId) where.sellerId = options.sellerId
    if (options.q) {
      where.OR = [
        { name: { contains: options.q, mode: 'insensitive' } },
        { description: { contains: options.q, mode: 'insensitive' } },
        { sku: { contains: options.q, mode: 'insensitive' } },
      ]
    }
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      where.price = {
        ...(options.minPrice !== undefined ? { gte: options.minPrice } : {}),
        ...(options.maxPrice !== undefined ? { lte: options.maxPrice } : {}),
      }
    }
    return where
  }

  private applyIncludeStatus(
    where: Prisma.ProductWhereInput,
    status?: ProductStatus | ProductStatus[],
  ): void {
    if (!status) return
    const values = Array.isArray(status) ? status : [status]
    where.status = { in: values as $Enums.ProductStatus[] }
  }

  private applyExcludeStatus(
    where: Prisma.ProductWhereInput,
    excludeStatus?: ProductStatus | ProductStatus[],
  ): void {
    if (!excludeStatus) return
    const values = Array.isArray(excludeStatus) ? excludeStatus : [excludeStatus]
    where.status = { notIn: values as $Enums.ProductStatus[] }
  }

  private baseProps(row: {
    id: string
    sellerId: string
    sku: string
    name: string
    description: string | null
    price: number
    status: string
    categoryId: string | null
    images: string[]
    rating: number
    reviewCount: number
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
  }): Omit<ProductProps, 'seller' | 'variants' | 'variantCount'> {
    return {
      id: row.id,
      sellerId: row.sellerId,
      sku: row.sku,
      name: row.name,
      description: row.description,
      price: row.price,
      status: row.status as ProductStatus,
      categoryId: row.categoryId,
      images: row.images,
      rating: row.rating,
      reviewCount: row.reviewCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      deletedAt: row.deletedAt,
    }
  }

  private listRowToEntity(row: ListRow): ProductEntity {
    return new ProductEntity({
      ...this.baseProps(row),
      seller: {
        id: row.seller.id,
        storeName: row.seller.storeName,
        rating: row.seller.rating,
      },
      variantCount: row._count.variants,
    })
  }

  private detailRowToEntity(row: DetailRow): ProductEntity {
    return new ProductEntity({
      ...this.baseProps(row),
      seller: {
        id: row.seller.id,
        userId: row.seller.userId,
        storeName: row.seller.storeName,
        rating: row.seller.rating,
      },
      variants: row.variants.map((v) => this.toVariantSnapshot(v)),
    })
  }

  private ownerRowToEntity(row: OwnerRow): ProductEntity {
    return new ProductEntity({
      ...this.baseProps(row),
      seller: {
        id: row.seller.id,
        userId: row.seller.userId,
        storeName: row.seller.storeName,
        rating: row.seller.rating,
      },
    })
  }

  private toVariantSnapshot(v: {
    id: string
    sku: string
    attributes: Prisma.JsonValue
    priceOverride: number | null
    stock: number
    reservedStock: number
    createdAt?: Date
    updatedAt?: Date
  }): ProductVariantSnapshot {
    return {
      id: v.id,
      sku: v.sku,
      attributes: this.jsonToRecord(v.attributes),
      priceOverride: v.priceOverride,
      stock: v.stock,
      reservedStock: v.reservedStock,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }
  }

  private jsonToRecord(value: Prisma.JsonValue): Record<string, unknown> {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>
    }
    return {}
  }
}
