import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseInterceptors,
  UseGuards,
  type RawBodyRequest,
} from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { CreatePaymentIntentDto } from './application/dtos/create-payment-intent.dto'
import { PaymentIntentView, PaymentService, WebhookAck } from './payment.service'
import { Idempotent } from '../../common/decorators/idempotent.decorator'
import { IdempotencyInterceptor } from '../../common/interceptors/idempotency.interceptor'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intent')
  @UseGuards(JwtAccessGuard)
  @UseInterceptors(IdempotencyInterceptor)
  @Idempotent({ required: false })
  @HttpCode(HttpStatus.CREATED)
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Create a Stripe payment intent for a pending-payment order' })
  @ApiResponse({ status: 201, description: 'Payment intent created.' })
  @ApiResponse({ status: 401, description: 'Authentication required.' })
  @ApiResponse({ status: 409, description: 'ORDER_NOT_PENDING_PAYMENT | PAYMENT_NOT_PENDING' })
  async createIntent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePaymentIntentDto,
  ): Promise<SuccessEnvelope<PaymentIntentView>> {
    const data = await this.paymentService.createIntent(user.userId, dto)
    return { success: true, data }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Receive and verify Stripe payment webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook received.' })
  @ApiResponse({ status: 400, description: 'INVALID_SIGNATURE' })
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Body() body: unknown,
    @Headers('stripe-signature') signature: string | undefined,
  ): Promise<WebhookAck> {
    return this.paymentService.handleWebhook(req.rawBody ?? JSON.stringify(body), signature)
  }
}
