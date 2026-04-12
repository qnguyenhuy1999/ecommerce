import { Module } from '@nestjs/common';

import { PAYMENT_GATEWAY } from './payment-gateway.interface';

 
@Module({
  providers: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { provide: PAYMENT_GATEWAY, useClass: StripeGateway },
  ],
  exports: [PAYMENT_GATEWAY],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PaymentGatewayModule {}