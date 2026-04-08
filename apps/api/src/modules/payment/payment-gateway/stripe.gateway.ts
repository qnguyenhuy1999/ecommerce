// TODO: implement Stripe gateway — concrete implementation of PaymentGateway
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import type {
  PaymentGateway,
  PaymentIntent,
  PaymentConfirmation,
  RefundResult,
  WebhookEvent,
} from './payment-gateway.interface';

@Injectable()
export class StripeGateway implements PaymentGateway {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  // TODO: implement all PaymentGateway interface methods
  async createIntent(orderId: string, amount: number, currency = 'SGD'): Promise<PaymentIntent> {
    throw new Error('TODO: implement StripeGateway.createIntent');
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentConfirmation> {
    throw new Error('TODO: implement StripeGateway.confirmPayment');
  }

  async refund(paymentIntentId: string, amount?: number): Promise<RefundResult> {
    throw new Error('TODO: implement StripeGateway.refund');
  }

  verifyWebhook(payload: string, signature: string): WebhookEvent {
    // TODO: implement webhook signature verification using Stripe.webhooks.constructEvent
    throw new Error('TODO: implement StripeGateway.verifyWebhook');
  }
}
