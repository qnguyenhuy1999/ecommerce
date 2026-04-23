import { Module } from '@nestjs/common';

import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

 
@Module({
  imports: [PaymentGatewayModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- NestJS modules are DI containers with no instance members.
export class PaymentModule {}
