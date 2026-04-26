import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { Idempotent } from '../../common/decorators/idempotent.decorator'
import { IdempotencyInterceptor } from '../../common/interceptors/idempotency.interceptor'
import { CreateOrderCommand } from './application/commands/create-order/create-order.command'
import { CreateOrderDto } from './application/dtos/create-order.dto'
import type { OrderSummaryView } from './application/views/order-summary.view'
import { OrderDomainExceptionFilter } from './presentation/filters/order-exception.filter'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAccessGuard)
@UseFilters(OrderDomainExceptionFilter)
@ApiCookieAuth('access_token')
export class OrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  @Idempotent()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Checkout the current user's cart into a pending-payment order" })
  @ApiResponse({ status: 201, description: 'Order created from the current cart.' })
  @ApiResponse({ status: 400, description: 'CART_EMPTY | PRODUCT_NOT_ACTIVE' })
  @ApiResponse({ status: 409, description: 'INSUFFICIENT_STOCK' })
  async createOrder(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateOrderDto,
  ): Promise<SuccessEnvelope<OrderSummaryView>> {
    const data = await this.commandBus.execute<CreateOrderCommand, OrderSummaryView>(
      new CreateOrderCommand(user.userId, dto.shippingAddress),
    )
    return { success: true, data }
  }
}
