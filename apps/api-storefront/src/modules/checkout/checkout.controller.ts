import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import type { SessionData } from '@ecom/auth/session.service'
import { ApiAuth } from '@ecom/nestjs-core/openapi/decorators/api-auth.decorator'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CheckoutService } from './checkout.service'
import type {
  ConfirmCheckoutDto,
  SetCheckoutAddressDto,
  SetCheckoutPaymentDto,
  SetCheckoutShippingDto,
} from './dto/checkout.dto'
import { CheckoutSessionDto, ConfirmCheckoutResponseDto } from './dto/checkout.dto'

@ApiTags('Storefront/Checkout')
@ApiAuth()
@ApiErrorResponses()
@Controller('checkout')
@UseGuards(AuthGuard)
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create checkout session from cart (reserves inventory)' })
  @ApiOkResponseData(CheckoutSessionDto)
  async createSession(@CurrentUser() user: SessionData) {
    return this.checkoutService.createSession(user)
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get checkout session state' })
  @ApiOkResponseData(CheckoutSessionDto)
  async getSession(@CurrentUser() user: SessionData, @Param('id') id: string) {
    return this.checkoutService.getSession(user, id)
  }

  @Patch('sessions/:id/address')
  @ApiOperation({ summary: 'Set delivery address (step 1 → 2)' })
  @ApiOkResponseData(CheckoutSessionDto)
  async setAddress(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: SetCheckoutAddressDto,
  ) {
    return this.checkoutService.setAddress(user, id, dto)
  }

  @Patch('sessions/:id/shipping')
  @ApiOperation({ summary: 'Set shipping methods per shop (step 2 → 3)' })
  @ApiOkResponseData(CheckoutSessionDto)
  async setShipping(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: SetCheckoutShippingDto,
  ) {
    return this.checkoutService.setShipping(user, id, dto)
  }

  @Patch('sessions/:id/payment')
  @ApiOperation({ summary: 'Set payment method (step 3 → 4 review)' })
  @ApiOkResponseData(CheckoutSessionDto)
  async setPayment(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: SetCheckoutPaymentDto,
  ) {
    return this.checkoutService.setPayment(user, id, dto)
  }

  @Post('sessions/:id/confirm')
  @ApiOperation({ summary: 'Confirm order — idempotent, enqueues async processing' })
  @ApiOkResponseData(ConfirmCheckoutResponseDto)
  async confirm(
    @CurrentUser() user: SessionData,
    @Param('id') id: string,
    @Body() dto: ConfirmCheckoutDto,
  ) {
    return this.checkoutService.confirmCheckout(user, id, dto)
  }

  @Get('orders/:orderId/status')
  @ApiOperation({ summary: 'Poll order processing status and distribution log' })
  @ApiOkResponseData(ConfirmCheckoutResponseDto)
  async getOrderStatus(@CurrentUser() user: SessionData, @Param('orderId') orderId: string) {
    return this.checkoutService.getOrderStatus(user, orderId)
  }
}
