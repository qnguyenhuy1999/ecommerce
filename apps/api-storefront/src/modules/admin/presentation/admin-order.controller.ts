import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import {
  type AuthenticatedUser,
  CurrentUser,
  JwtAccessGuard,
  Roles,
  RolesGuard,
} from '@ecom/nest-auth'

import { TransitionOrderStatusCommand } from '../../order/application/commands/transition-order-status/transition-order-status.command'
import { TransitionSubOrderStatusCommand } from '../../order/application/commands/transition-sub-order-status/transition-sub-order-status.command'
import { ListAdminOrdersDto } from '../../order/application/dtos/list-admin-orders.dto'
import {
  TransitionOrderStatusDto,
  TransitionSubOrderStatusDto,
} from '../../order/application/dtos/transition-order-status.dto'
import { GetAdminOrderQuery } from '../../order/application/queries/get-admin-order/get-admin-order.query'
import { ListAdminOrdersQuery } from '../../order/application/queries/list-admin-orders/list-admin-orders.query'
import type {
  AdminOrderDetailView,
  AdminOrderListPage,
} from '../../order/application/views/admin-order.view'
import { OrderDomainExceptionFilter } from '../../order/presentation/filters/order-exception.filter'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

interface ListEnvelope<T> {
  success: true
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

@ApiTags('admin')
@Controller('admin/orders')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('access_token')
@UseFilters(OrderDomainExceptionFilter)
export class AdminOrderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List orders for the admin operations console.' })
  @ApiResponse({ status: 200, description: 'Paginated order summaries.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  async list(
    @Query() filters: ListAdminOrdersDto,
  ): Promise<ListEnvelope<AdminOrderListPage['data'][number]>> {
    const page = await this.queryBus.execute<ListAdminOrdersQuery, AdminOrderListPage>(
      new ListAdminOrdersQuery(filters),
    )
    return {
      success: true,
      data: page.data,
      meta: {
        total: page.total,
        page: page.page,
        limit: page.limit,
        totalPages: page.totalPages,
      },
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single order with sub-orders and items.' })
  @ApiResponse({ status: 200, description: 'Order detail view.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'ORDER_NOT_FOUND' })
  async getById(@Param('id') id: string): Promise<SuccessEnvelope<AdminOrderDetailView>> {
    const detail = await this.queryBus.execute<GetAdminOrderQuery, AdminOrderDetailView>(
      new GetAdminOrderQuery(id),
    )
    return { success: true, data: detail }
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin override of the top-level order status.' })
  @ApiResponse({ status: 200, description: 'Order updated.' })
  @ApiResponse({ status: 400, description: 'INVALID_STATUS_TRANSITION' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'ORDER_NOT_FOUND' })
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TransitionOrderStatusDto,
  ): Promise<SuccessEnvelope<AdminOrderDetailView>> {
    const detail = await this.commandBus.execute<
      TransitionOrderStatusCommand,
      AdminOrderDetailView
    >(new TransitionOrderStatusCommand(id, dto.status, user.userId))
    return { success: true, data: detail }
  }

  @Patch('sub-orders/:subOrderId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a single sub-order fulfillment status.' })
  @ApiResponse({ status: 200, description: 'Sub-order updated; returns full order detail.' })
  @ApiResponse({
    status: 400,
    description: 'INVALID_STATUS_TRANSITION | SHIPPING_TRACKING_REQUIRED',
  })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'SUB_ORDER_NOT_FOUND' })
  async updateSubOrderStatus(
    @Param('subOrderId') subOrderId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: TransitionSubOrderStatusDto,
  ): Promise<SuccessEnvelope<AdminOrderDetailView>> {
    const detail = await this.commandBus.execute<
      TransitionSubOrderStatusCommand,
      AdminOrderDetailView
    >(
      new TransitionSubOrderStatusCommand(
        subOrderId,
        dto.status,
        user.userId,
        dto.shippingTracking
          ? {
              carrier: dto.shippingTracking.carrier,
              trackingNumber: dto.shippingTracking.trackingNumber,
            }
          : undefined,
      ),
    )
    return { success: true, data: detail }
  }
}
