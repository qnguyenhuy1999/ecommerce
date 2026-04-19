import { Module } from '@nestjs/common'

import { PAYMENT_GATEWAY } from './payment-gateway.interface'
import { StripeGateway } from './stripe.gateway'

@Module({
  providers: [{ provide: PAYMENT_GATEWAY, useClass: StripeGateway }],
  exports: [PAYMENT_GATEWAY],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PaymentGatewayModule {}
