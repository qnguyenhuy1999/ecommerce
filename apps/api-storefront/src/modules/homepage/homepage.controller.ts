import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { HomepageDto } from './dto/homepage.dto'
import { HomepageService } from './homepage.service'

@ApiTags('Storefront/Homepage')
@ApiErrorResponses()
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get all landing page data (categories, vouchers, flash sale, featured products, shops)',
  })
  @ApiOkResponseData(HomepageDto)
  async getHomepage() {
    return this.homepageService.getHomepage()
  }
}
