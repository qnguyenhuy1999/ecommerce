import { Controller, Get, Param } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { ProductDetailResponseDto } from './dto/product-detail.dto'
import { ProductsService } from './products.service'

@ApiTags('Storefront/Products')
@ApiErrorResponses()
@ApiExtraModels(ProductDetailResponseDto)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get product detail page data' })
  @ApiOkResponseData(ProductDetailResponseDto)
  async getProductDetail(@Param('slug') slug: string) {
    return this.productsService.getProductDetail(slug)
  }
}
