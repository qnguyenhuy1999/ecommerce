import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth/session.service'
import { ApiAuth, ApiErrorResponses, ApiOkResponseData } from '@ecom/nestjs-core/openapi'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { ShopService } from '../shop/shop.service'
import { DashboardService } from './dashboard.service'

@ApiTags('Seller/Dashboard')
@ApiAuth()
@ApiErrorResponses()
@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly shopService: ShopService,
  ) {}

  @Get('bundle')
  @ApiOkResponseData(Object)
  async bundle(@CurrentUser() user: SessionData) {
    const shopId = await this.shopService.getShopId(user.userId)
    return this.dashboardService.getBundle(shopId)
  }
}
