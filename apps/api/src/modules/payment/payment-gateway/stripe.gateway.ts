import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import type {
  PaymentConfirmation,
  PaymentGateway,
  PaymentIntent,
  RefundResult,
  WebhookEvent,
} from './payment-gateway.interface'

// TODO(@platform, 2026-04-23): Implement Stripe gateway (concrete PaymentGateway adapter).
@Injectable()
export class StripeGateway implements PaymentGateway {
  private readonly stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    })
  }

  // TODO(@platform, 2026-04-23): Implement PaymentGateway interface methods using Stripe SDK.
  // eslint-disable-next-line @typescript-eslint/require-await -- Placeholder implementation; real method will await Stripe API.
  async createIntent(_orderId: string, _amount: number, _currency = 'SGD'): Promise<PaymentIntent> {
    void this.stripe
    throw new Error('TODO: implement StripeGateway.createIntent')
  }

  // eslint-disable-next-line @typescript-eslint/require-await -- Placeholder implementation; real method will await Stripe API.
  async confirmPayment(_paymentIntentId: string): Promise<PaymentConfirmation> {
    throw new Error('TODO: implement StripeGateway.confirmPayment')
  }

  // eslint-disable-next-line @typescript-eslint/require-await -- Placeholder implementation; real method will await Stripe API.
  async refund(_paymentIntentId: string, _amount?: number): Promise<RefundResult> {
    throw new Error('TODO: implement StripeGateway.refund')
  }

  verifyWebhook(_payload: string, _signature: string): WebhookEvent {
    // TODO(@platform, 2026-04-23): Verify webhook signatures using Stripe.webhooks.constructEvent.
    throw new Error('TODO: implement StripeGateway.verifyWebhook')
  }
}
