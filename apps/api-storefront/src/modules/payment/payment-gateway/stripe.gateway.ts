import { Injectable, InternalServerErrorException } from '@nestjs/common'
import Stripe from 'stripe'

import type {
  PaymentConfirmation,
  PaymentGateway,
  PaymentIntent,
  RefundResult,
  WebhookEvent,
} from './payment-gateway.interface'

@Injectable()
export class StripeGateway implements PaymentGateway {
  private readonly stripe: Stripe
  private readonly webhookSecret: string | undefined

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    })
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  }

  async createIntent(
    orderId: string,
    amount: number,
    currency = 'SGD',
    idempotencyKey?: string,
  ): Promise<PaymentIntent> {
    this.assertConfigured()
    const intent = await this.stripe.paymentIntents.create(
      {
        amount: toMinorUnits(amount),
        currency: currency.toLowerCase(),
        metadata: { orderId },
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey: idempotencyKey ?? `order:${orderId}:payment-intent` },
    )

    return this.toPaymentIntent(intent)
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentConfirmation> {
    this.assertConfigured()
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      id: intent.id,
      status: intent.status === 'succeeded' ? 'succeeded' : 'failed',
      amount: fromMinorUnits(intent.amount),
    }
  }

  async refund(paymentIntentId: string, amount?: number): Promise<RefundResult> {
    this.assertConfigured()
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount === undefined ? {} : { amount: toMinorUnits(amount) }),
    })

    return {
      id: refund.id,
      status: refund.status === 'succeeded' || refund.status === 'pending' ? refund.status : 'failed',
      amount: fromMinorUnits(refund.amount),
    }
  }

  verifyWebhook(payload: string | Buffer, signature: string): WebhookEvent {
    if (!this.webhookSecret) {
      throw new InternalServerErrorException('Stripe webhook secret is not configured')
    }

    const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret)
    const object = event.data.object
    const paymentIntentId = extractPaymentIntentId(object)
    const status = extractStatus(object)

    return {
      id: event.id,
      type: event.type,
      paymentIntentId,
      status,
      raw: event,
    }
  }

  private toPaymentIntent(intent: Stripe.PaymentIntent): PaymentIntent {
    return {
      id: intent.id,
      clientSecret: intent.client_secret ?? '',
      amount: fromMinorUnits(intent.amount),
      currency: intent.currency.toUpperCase(),
      status: intent.status === 'succeeded' ? 'succeeded' : intent.status === 'canceled' ? 'failed' : 'pending',
    }
  }

  private assertConfigured(): void {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new InternalServerErrorException('Stripe secret key is not configured')
    }
  }
}

function toMinorUnits(amount: number): number {
  return Math.round(amount * 100)
}

function fromMinorUnits(amount: number): number {
  return amount / 100
}

function extractPaymentIntentId(object: Stripe.Event.Data.Object): string {
  if (
    'id' in object &&
    typeof object.id === 'string' &&
    'object' in object &&
    object.object === 'payment_intent'
  ) {
    return object.id
  }
  if ('payment_intent' in object) {
    const paymentIntent = object.payment_intent
    if (typeof paymentIntent === 'string') return paymentIntent
    if (paymentIntent && typeof paymentIntent === 'object' && 'id' in paymentIntent) {
      return typeof paymentIntent.id === 'string' ? paymentIntent.id : ''
    }
  }
  return ''
}

function extractStatus(object: Stripe.Event.Data.Object): string {
  if ('status' in object && typeof object.status === 'string') return object.status
  return ''
}
