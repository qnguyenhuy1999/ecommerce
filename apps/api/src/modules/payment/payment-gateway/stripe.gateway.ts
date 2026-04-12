// TODO: implement Stripe gateway — concrete implementation of PaymentGateway
import type {
  PaymentGateway,
  PaymentIntent,
  PaymentConfirmation,
  RefundResult,
  WebhookEvent,
} from './payment-gateway.interface';

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeGateway implements PaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  // TODO: implement all PaymentGateway interface methods
  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async createIntent(_orderId: string, _amount: number, _currency = 'SGD'): Promise<PaymentIntent> {
    throw new Error('TODO: implement StripeGateway.createIntent');
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async confirmPayment(_paymentIntentId: string): Promise<PaymentConfirmation> {
    throw new Error('TODO: implement StripeGateway.confirmPayment');
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async refund(_paymentIntentId: string, _amount?: number): Promise<RefundResult> {
    throw new Error('TODO: implement StripeGateway.refund');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  verifyWebhook(_payload: string, _signature: string): WebhookEvent {
    // TODO: implement webhook signature verification using Stripe.webhooks.constructEvent
    throw new Error('TODO: implement StripeGateway.verifyWebhook');
  }
}
