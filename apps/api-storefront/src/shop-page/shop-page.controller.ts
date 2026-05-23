import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrorResponses, ApiOkResponseData } from '@ecom/nestjs-core/openapi'
import {
  ShopDetailResponseDto,
  ShopProductsQueryDto,
  ShopProductsResponseDto,
  ShopReviewsQueryDto,
  ShopReviewsResponseDto,
} from './dto/shop-page.dto'
import { ShopPageService } from './shop-page.service'

@ApiTags('Storefront/Shops')
@ApiErrorResponses()
@ApiExtraModels(ShopDetailResponseDto, ShopProductsResponseDto, ShopReviewsResponseDto)
@Controller('shops')
export class ShopPageController {
  constructor(private readonly shopPageService: ShopPageService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get shop detail page bootstrap data' })
  @ApiOkResponseData(ShopDetailResponseDto)
  async getShopPage(@Param('slug') slug: string) {
    return this.shopPageService.getShopPage(slug)
  }

  @Get(':slug/products')
  @ApiOperation({ summary: 'Get shop products tab data' })
  @ApiOkResponseData(ShopProductsResponseDto)
  async getShopProducts(@Param('slug') slug: string, @Query() query: ShopProductsQueryDto) {
    return this.shopPageService.getShopProducts(slug, query)
  }

  @Get(':slug/reviews')
  @ApiOperation({ summary: 'Get shop reviews tab data' })
  @ApiOkResponseData(ShopReviewsResponseDto)
  async getShopReviews(@Param('slug') slug: string, @Query() query: ShopReviewsQueryDto) {
    return this.shopPageService.getShopReviews(slug, query)
  }
}
