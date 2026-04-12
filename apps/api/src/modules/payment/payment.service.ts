// TODO: implement payment service
// Uses PaymentGateway abstraction, NOT Stripe directly
// - createPaymentIntent: create intent via gateway, save Payment record
// - handleWebhook: verify signature, idempotency check, emit PAYMENT_SUCCESS
// - refund: call gateway refund method
import { Injectable } from '@nestjs/common';

 
@Injectable()
 

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PaymentService {}