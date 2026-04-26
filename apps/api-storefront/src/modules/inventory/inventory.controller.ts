import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ReservationStatus } from '@prisma/client'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import {
  AdjustStockDto,
  ListLowStockQueryDto,
  ListReservationsQueryDto,
} from './application/dtos/adjust-stock.dto'
import {
  type AdjustStockResult,
  InventoryService,
  type LowStockVariantView,
  type PaginatedView,
  type ReservationView,
} from './inventory.service'
import { InventoryDomainExceptionFilter } from './presentation/filters/inventory-exception.filter'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@UseFilters(InventoryDomainExceptionFilter)
@ApiCookieAuth('access_token')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('low-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List variants whose available stock is at or below a threshold.' })
  @ApiResponse({ status: 200, description: 'Paginated low-stock variants.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  async listLowStock(
    @Query() query: ListLowStockQueryDto,
  ): Promise<SuccessEnvelope<PaginatedView<LowStockVariantView>>> {
    const data = await this.inventory.listLowStock({
      threshold: query.threshold,
      page: query.page,
      limit: query.limit,
    })
    return { success: true, data }
  }

  @Get('reservations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Audit inventory reservations across orders/variants.' })
  @ApiResponse({ status: 200, description: 'Paginated reservation audit feed.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  async listReservations(
    @Query() query: ListReservationsQueryDto,
  ): Promise<SuccessEnvelope<PaginatedView<ReservationView>>> {
    const data = await this.inventory.listReservations({
      variantId: query.variantId,
      orderId: query.orderId,
      status: query.status as ReservationStatus | undefined,
      page: query.page,
      limit: query.limit,
    })
    return { success: true, data }
  }

  @Post('variants/:variantId/adjust')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Apply a signed delta to a variant\'s stock (admin only).' })
  @ApiResponse({ status: 200, description: 'Stock adjusted.' })
  @ApiResponse({ status: 400, description: 'STOCK_ADJUSTMENT_INVALID' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'VARIANT_NOT_FOUND' })
  async adjustStock(
    @Param('variantId') variantId: string,
    @Body() dto: AdjustStockDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SuccessEnvelope<AdjustStockResult>> {
    const data = await this.inventory.adjustStock({
      variantId,
      delta: dto.delta,
      reason: dto.reason,
      adminUserId: user.userId,
    })
    return { success: true, data }
  }

  @Post('reservations/:reservationId/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm an active reservation (deducts stock).' })
  @ApiResponse({ status: 200, description: 'Reservation confirmed.' })
  @ApiResponse({ status: 404, description: 'RESERVATION_NOT_FOUND' })
  @ApiResponse({ status: 409, description: 'RESERVATION_NOT_ACTIVE | RESERVATION_STOCK_MISMATCH' })
  async confirmReservation(
    @Param('reservationId') reservationId: string,
  ): Promise<SuccessEnvelope<ReservationView>> {
    const data = await this.inventory.confirmReservation(reservationId)
    return { success: true, data }
  }

  @Post('reservations/:reservationId/release')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Release an active reservation (restores reserved stock).' })
  @ApiResponse({ status: 200, description: 'Reservation released.' })
  @ApiResponse({ status: 404, description: 'RESERVATION_NOT_FOUND' })
  @ApiResponse({ status: 409, description: 'RESERVATION_NOT_ACTIVE | RESERVATION_STOCK_MISMATCH' })
  async releaseReservation(
    @Param('reservationId') reservationId: string,
  ): Promise<SuccessEnvelope<ReservationView>> {
    const data = await this.inventory.releaseReservation(reservationId)
    return { success: true, data }
  }
}
