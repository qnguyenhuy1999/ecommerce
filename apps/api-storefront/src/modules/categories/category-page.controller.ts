import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { CategoryPageService } from './category-page.service'
import type { CategoryPageQueryDto } from './dto/category-page.dto'
import { CategoryListItemDto, CategoryPageResponseDto } from './dto/category-page.dto'

@ApiTags('Storefront/Categories')
@ApiErrorResponses()
@ApiExtraModels(CategoryPageResponseDto, CategoryListItemDto)
@Controller('categories')
export class CategoryPageController {
  constructor(private readonly categoryPageService: CategoryPageService) {}

  @Get()
  @ApiOperation({ summary: 'List root categories with children' })
  @ApiOkResponseData(CategoryListItemDto)
  async listCategories() {
    return this.categoryPageService.listCategories()
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category page data' })
  @ApiOkResponseData(CategoryPageResponseDto)
  async getCategoryPage(@Param('slug') slug: string, @Query() query: CategoryPageQueryDto) {
    return this.categoryPageService.getCategoryPage(slug, query)
  }
}
