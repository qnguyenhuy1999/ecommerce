import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser, JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import { ProductDomainExceptionFilter } from './filters/product-exception.filter'
import {
  toDetailView,
  toListItemView,
  type ProductDetailView,
  type ProductListItemView,
} from './mappers/product-response.mapper'
import { CreateProductCommand } from '../application/commands/create-product/create-product.command'
import { DeleteProductCommand } from '../application/commands/delete-product/delete-product.command'
import { UpdateProductCommand } from '../application/commands/update-product/update-product.command'
import { CreateProductDto } from '../application/dtos/create-product.dto'
import { ListProductsDto } from '../application/dtos/list-products.dto'
import { UpdateProductDto } from '../application/dtos/update-product.dto'
import { GetProductQuery } from '../application/queries/get-product/get-product.query'
import type { ListProductsResult } from '../application/queries/list-products/list-products.handler'
import { ListProductsQuery } from '../application/queries/list-products/list-products.query'
import type { VariantView } from '../application/queries/list-variants/list-variants.handler'
import { ListProductVariantsQuery } from '../application/queries/list-variants/list-variants.query'
import type { ProductEntity } from '../domain/entities/product.entity'

interface AuthenticatedUser {
  userId: string
  email: string
  role: string
  jti: string
  exp: number
}

interface Paginated<T> {
  success: true
  data: T[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

interface Envelope<T> {
  success: true
  data: T
}

@ApiTags('products')
@Controller('products')
@UseFilters(ProductDomainExceptionFilter)
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List products (public)' })
  async list(@Query() query: ListProductsDto): Promise<Paginated<ProductListItemView>> {
    const result = await this.queryBus.execute<ListProductsQuery, ListProductsResult>(
      new ListProductsQuery(query),
    )
    return {
      success: true,
      data: result.data.map(toListItemView),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product detail (public)' })
  async findOne(@Param('id') id: string): Promise<Envelope<ProductDetailView>> {
    const product = await this.queryBus.execute<GetProductQuery, ProductEntity>(
      new GetProductQuery(id),
    )
    return { success: true, data: toDetailView(product) }
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'List product variants (public)' })
  async listVariants(@Param('id') id: string): Promise<Envelope<VariantView[]>> {
    const data = await this.queryBus.execute<ListProductVariantsQuery, VariantView[]>(
      new ListProductVariantsQuery(id),
    )
    return { success: true, data }
  }

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('SELLER')
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a product (seller only, KYC approved)' })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProductDto,
  ): Promise<Envelope<ProductDetailView>> {
    const product = await this.commandBus.execute<CreateProductCommand, ProductEntity>(
      new CreateProductCommand(user.userId, dto),
    )
    return { success: true, data: toDetailView(product) }
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('SELLER')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update a product (seller owner only)' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProductDto,
  ): Promise<Envelope<ProductDetailView>> {
    const product = await this.commandBus.execute<UpdateProductCommand, ProductEntity>(
      new UpdateProductCommand(id, user.userId, dto),
    )
    return { success: true, data: toDetailView(product) }
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('SELLER')
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a product (seller owner only)' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.commandBus.execute(new DeleteProductCommand(id, user.userId))
  }
}
