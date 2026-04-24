import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, PrismaClient, ProductStatus } from '@prisma/client'

import { CreateProductDto, CreateProductStatus } from './dto/create-product.dto'
import { ListProductsDto } from './dto/list-products.dto'
import { UpdateProductDto } from './dto/update-product.dto'

const PRODUCT_LIST_SELECT = {
  id: true,
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
  seller: { select: { id: true, storeName: true, rating: true } },
  _count: { select: { variants: true } },
} satisfies Prisma.ProductSelect

const PRODUCT_DETAIL_INCLUDE = {
  seller: { select: { id: true, storeName: true, rating: true } },
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

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaClient) {}

  async list(query: ListProductsDto) {
    const { q, category, sellerId, minPrice, maxPrice, page, limit, sort, order } = query

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new BadRequestException('minPrice must not exceed maxPrice')
    }

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      deletedAt: null,
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (category) where.categoryId = category
    if (sellerId) where.sellerId = sellerId
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      }
    }

    const [rows, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        select: PRODUCT_LIST_SELECT,
      }),
      this.prisma.product.count({ where }),
    ])

    const data = rows.map(({ _count, ...rest }) => ({
      ...rest,
      variantCount: _count.variants,
    }))

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    }
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null, status: { not: ProductStatus.DELETED } },
      include: PRODUCT_DETAIL_INCLUDE,
    })

    if (!product) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      })
    }

    return product
  }

  async create(userId: string, dto: CreateProductDto) {
    const seller = await this.prisma.seller.findUnique({ where: { userId } })
    if (!seller) {
      throw new ForbiddenException({
        code: 'SELLER_NOT_FOUND',
        message: 'Authenticated user is not a registered seller',
      })
    }
    if (seller.kycStatus !== 'APPROVED') {
      throw new ForbiddenException({
        code: 'KYC_NOT_APPROVED',
        message: 'Seller KYC must be approved before publishing products',
      })
    }

    await this.assertSkuAvailable(seller.id, dto.sku)
    this.assertUniqueVariantSkus(dto)

    const status =
      dto.status === CreateProductStatus.ACTIVE ? ProductStatus.ACTIVE : ProductStatus.DRAFT

    const variantsPayload = this.buildVariantsPayload(dto)

    try {
      return await this.prisma.product.create({
        data: {
          sellerId: seller.id,
          sku: dto.sku,
          name: dto.name,
          description: dto.description,
          price: dto.price,
          status,
          categoryId: dto.categoryId,
          images: dto.images ?? [],
          variants: { create: variantsPayload },
        },
        include: PRODUCT_DETAIL_INCLUDE,
      })
    } catch (error) {
      throw this.translatePrismaError(error)
    }
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, sellerId: true, status: true, seller: { select: { userId: true } } },
    })
    if (!product) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      })
    }
    if (product.seller.userId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_PRODUCT_OWNER',
        message: 'You do not own this product',
      })
    }
    if (product.status === ProductStatus.DELETED) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      })
    }

    const data: Prisma.ProductUpdateInput = {}
    if (dto.sku !== undefined) data.sku = dto.sku
    if (dto.name !== undefined) data.name = dto.name
    if (dto.description !== undefined) data.description = dto.description
    if (dto.price !== undefined) data.price = dto.price
    if (dto.status !== undefined) data.status = dto.status
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId
    if (dto.images !== undefined) data.images = dto.images

    try {
      return await this.prisma.product.update({
        where: { id },
        data,
        include: PRODUCT_DETAIL_INCLUDE,
      })
    } catch (error) {
      throw this.translatePrismaError(error)
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, status: true, seller: { select: { userId: true } } },
    })
    if (!product || product.status === ProductStatus.DELETED) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      })
    }
    if (product.seller.userId !== userId) {
      throw new ForbiddenException({
        code: 'NOT_PRODUCT_OWNER',
        message: 'You do not own this product',
      })
    }

    await this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.DELETED, deletedAt: new Date() },
    })
  }

  async listVariants(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null, status: { not: ProductStatus.DELETED } },
      select: { id: true },
    })
    if (!product) {
      throw new NotFoundException({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
      })
    }

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
      },
    })

    return variants.map((v) => ({
      ...v,
      availableStock: Math.max(0, v.stock - v.reservedStock),
    }))
  }

  private async assertSkuAvailable(sellerId: string, sku: string): Promise<void> {
    const existing = await this.prisma.product.findUnique({
      where: { sellerId_sku: { sellerId, sku } },
      select: { id: true, deletedAt: true },
    })
    if (existing && !existing.deletedAt) {
      throw new BadRequestException({
        code: 'SKU_EXISTS',
        message: `A product with SKU "${sku}" already exists for this seller`,
      })
    }
  }

  private assertUniqueVariantSkus(dto: CreateProductDto): void {
    if (!dto.variants || dto.variants.length === 0) return
    const seen = new Set<string>()
    for (const variant of dto.variants) {
      if (seen.has(variant.sku)) {
        throw new BadRequestException({
          code: 'SKU_EXISTS',
          message: `Duplicate variant SKU "${variant.sku}"`,
        })
      }
      seen.add(variant.sku)
    }
  }

  private buildVariantsPayload(
    dto: CreateProductDto,
  ): Prisma.ProductVariantCreateWithoutProductInput[] {
    if (dto.variants && dto.variants.length > 0) {
      return dto.variants.map((variant) => ({
        sku: variant.sku,
        attributes: variant.attributes as Prisma.InputJsonValue,
        priceOverride: variant.priceOverride,
        stock: variant.stock ?? 0,
      }))
    }
    return [
      {
        sku: dto.sku,
        attributes: {} as Prisma.InputJsonValue,
        stock: 0,
      },
    ]
  }

  private translatePrismaError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new BadRequestException({
          code: 'SKU_EXISTS',
          message: 'SKU must be unique for this seller',
        })
      }
      if (error.code === 'P2003') {
        return new NotFoundException({
          code: 'CATEGORY_NOT_FOUND',
          message: 'Referenced category does not exist',
        })
      }
    }
    return error instanceof Error ? error : new Error('Unknown error')
  }
}
