import { Injectable } from '@nestjs/common'

// TODO(@platform, 2026-04-23): Implement PaymentService using PaymentGateway (not Stripe directly).
// Responsibilities: create payment intents, verify webhooks (signature + idempotency), and process refunds.
@Injectable()
// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- Placeholder service kept for module wiring.
export class PaymentService {}
