import { Module } from '@nestjs/common';
import { PaymentGateway, PAYMENT_GATEWAY } from './payment-gateway.interface';
import { StripeGateway } from './stripe.gateway';

@Module({
  providers: [
    { provide: PAYMENT_GATEWAY, useClass: StripeGateway },
  ],
  exports: [PAYMENT_GATEWAY],
})
export class PaymentGatewayModule {}