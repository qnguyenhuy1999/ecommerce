import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth/session.service'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiAuth } from '@ecom/nestjs-core/openapi/decorators/api-auth.decorator'
import { ShopService } from './shop.service'
import { UpdateShopDto } from './dto/update-shop.dto'

@ApiTags('Seller/Shop')
@ApiAuth()
@ApiErrorResponses()
@Controller('shop')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOkResponseData(Object)
  async getShop(@CurrentUser() user: SessionData) {
    return this.shopService.getShop(user.userId)
  }

  @Put()
  @ApiOkResponseData(Object)
  async updateShop(@CurrentUser() user: SessionData, @Body() dto: UpdateShopDto) {
    return this.shopService.updateShop(user.userId, dto)
  }
}
