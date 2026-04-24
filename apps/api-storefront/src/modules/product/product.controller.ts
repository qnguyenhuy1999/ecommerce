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
  UseGuards,
} from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser, JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import { CreateProductDto } from './dto/create-product.dto'
import { ListProductsDto } from './dto/list-products.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'

interface AuthenticatedUser {
  userId: string
  email: string
  role: string
  jti: string
  exp: number
}

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List products (public)' })
  async list(@Query() query: ListProductsDto) {
    const { data, meta } = await this.productService.list(query)
    return { success: true, data, meta }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product detail (public)' })
  async findOne(@Param('id') id: string) {
    const data = await this.productService.findOne(id)
    return { success: true, data }
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'List product variants (public)' })
  async listVariants(@Param('id') id: string) {
    const data = await this.productService.listVariants(id)
    return { success: true, data }
  }

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('SELLER')
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a product (seller only, KYC approved)' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProductDto) {
    const data = await this.productService.create(user.userId, dto)
    return { success: true, data }
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
  ) {
    const data = await this.productService.update(id, user.userId, dto)
    return { success: true, data }
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles('SELLER')
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a product (seller owner only)' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.productService.remove(id, user.userId)
  }
}
