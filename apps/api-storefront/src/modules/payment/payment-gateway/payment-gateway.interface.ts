// Payment gateway abstraction interface
// All payment gateways MUST implement this interface
// To add PayPal: create PayPalGateway implements PaymentGateway, swap provider in PaymentGatewayModule

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY')

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed'
}

export interface PaymentConfirmation {
  id: string
  status: 'succeeded' | 'failed'
  amount: number
}

export interface RefundResult {
  id: string
  status: 'succeeded' | 'pending' | 'failed'
  amount: number
}

export interface WebhookEvent {
  id: string
  type: string
  paymentIntentId: string
  status: string
  raw: unknown
}

export interface PaymentGateway {
  createIntent(
    orderId: string,
    amount: number,
    currency?: string,
    idempotencyKey?: string,
  ): Promise<PaymentIntent>
  confirmPayment(paymentIntentId: string): Promise<PaymentConfirmation>
  refund(paymentIntentId: string, amount?: number): Promise<RefundResult>
  verifyWebhook(payload: string | Buffer, signature: string): WebhookEvent
}
