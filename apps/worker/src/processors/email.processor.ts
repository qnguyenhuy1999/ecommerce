import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'

import { sendEmail } from '@ecom/email'

/**
 * EmailProcessor
 *
 * Pulls jobs off the `email` queue and dispatches them through
 * `@ecom/email`'s SMTP client. Each known job name maps to a templated
 * subject + body; unknown jobs are logged and skipped (no retries) so a
 * stray producer cannot wedge the queue.
 *
 * Job payload conventions:
 *   - All jobs include `to` (recipient email).
 *   - Order jobs include `orderId` and `orderNumber`.
 *   - Payment jobs include `orderId`, `orderNumber`, and `paymentId`.
 *   - Seller-approved includes `sellerId` and `storeName`.
 *   - Welcome includes `name` (optional).
 */
@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name)

  async process(job: Job<EmailJobPayload>): Promise<void> {
    const message = buildMessage(job.name, job.data)
    if (!message) {
      this.logger.warn(`Unknown email job: ${job.name}`)
      return
    }

    if (!message.to) {
      this.logger.warn(`Email job ${job.name} missing recipient; skipping`)
      return
    }

    try {
      await sendEmail({ to: message.to, subject: message.subject, html: message.html })
      this.logger.log(`Sent ${job.name} email to ${message.to}`)
    } catch (err) {
      this.logger.error(
        `Failed to send ${job.name} email to ${message.to}: ${(err as Error).message}`,
      )
      throw err
    }
  }
}

interface EmailJobPayload {
  to?: string
  userId?: string
  name?: string
  orderId?: string
  orderNumber?: string
  paymentId?: string
  sellerId?: string
  storeName?: string
  reason?: string
  trackingNumber?: string
  [key: string]: unknown
}

interface BuiltMessage {
  to: string | undefined
  subject: string
  html: string
}

export function buildMessage(jobName: string, payload: EmailJobPayload): BuiltMessage | null {
  switch (jobName) {
    case 'welcome':
      return {
        to: payload.to,
        subject: 'Welcome to the marketplace',
        html: welcomeTemplate(payload),
      }
    case 'order-confirmation':
      return {
        to: payload.to,
        subject: `Order ${payload.orderNumber ?? ''} confirmed`,
        html: orderConfirmationTemplate(payload),
      }
    case 'seller-approved':
      return {
        to: payload.to,
        subject: 'Your seller application has been approved',
        html: sellerApprovedTemplate(payload),
      }
    case 'seller-rejected':
      return {
        to: payload.to,
        subject: 'Your seller application update',
        html: sellerRejectedTemplate(payload),
      }
    case 'order-shipped':
      return {
        to: payload.to,
        subject: `Order ${payload.orderNumber ?? ''} shipped`,
        html: orderShippedTemplate(payload),
      }
    case 'order-cancelled':
      return {
        to: payload.to,
        subject: `Order ${payload.orderNumber ?? ''} cancelled`,
        html: orderCancelledTemplate(payload),
      }
    case 'refund-approved':
      return {
        to: payload.to,
        subject: `Refund approved for order ${payload.orderNumber ?? ''}`,
        html: refundApprovedTemplate(payload),
      }
    case 'refund-requested':
      return {
        to: payload.to,
        subject: `Refund requested for order ${payload.orderNumber ?? ''}`,
        html: refundRequestedTemplate(payload),
      }
    case 'payment-failed':
      return {
        to: payload.to,
        subject: `Payment failed for order ${payload.orderNumber ?? ''}`,
        html: paymentFailedTemplate(payload),
      }
    default:
      return null
  }
}

function welcomeTemplate(p: EmailJobPayload): string {
  const greeting = p.name ? `Hi ${escapeHtml(p.name)},` : 'Hi,'
  return `<p>${greeting}</p><p>Welcome aboard! Your account has been created and you can start shopping right away.</p>`
}

function orderConfirmationTemplate(p: EmailJobPayload): string {
  const num = escapeHtml(p.orderNumber ?? '')
  return `<p>Thanks for your order!</p><p>We received your payment for order <strong>${num}</strong> and our sellers are preparing it for shipment.</p>`
}

function sellerApprovedTemplate(p: EmailJobPayload): string {
  const store = escapeHtml(p.storeName ?? 'your store')
  return `<p>Great news — <strong>${store}</strong> has been approved.</p><p>You can now publish products and start selling on the marketplace.</p>`
}

function sellerRejectedTemplate(p: EmailJobPayload): string {
  const store = escapeHtml(p.storeName ?? 'your store')
  const reason = p.reason ? `<p>Reason: ${escapeHtml(p.reason)}</p>` : ''
  return `<p>Your application for <strong>${store}</strong> needs more information before approval.</p>${reason}<p>Please update your seller profile and resubmit when ready.</p>`
}

function orderShippedTemplate(p: EmailJobPayload): string {
  const num = escapeHtml(p.orderNumber ?? '')
  const tracking = p.trackingNumber ? `<p>Tracking: ${escapeHtml(p.trackingNumber)}</p>` : ''
  return `<p>Your order <strong>${num}</strong> has shipped.</p>${tracking}<p>You can follow progress from your order history.</p>`
}

function refundRequestedTemplate(p: EmailJobPayload): string {
  const num = escapeHtml(p.orderNumber ?? '')
  return `<p>Your refund request for order <strong>${num}</strong> is being processed.</p><p>We will notify you when the refund is complete.</p>`
}

function orderCancelledTemplate(p: EmailJobPayload): string {
  const num = escapeHtml(p.orderNumber ?? '')
  return `<p>Order <strong>${num}</strong> has been cancelled.</p><p>If you were charged, any refund will be processed separately.</p>`
}

function refundApprovedTemplate(p: EmailJobPayload): string {
  const num = escapeHtml(p.orderNumber ?? '')
  return `<p>Your refund for order <strong>${num}</strong> has been approved.</p><p>The funds will return to your original payment method after processing.</p>`
}

function paymentFailedTemplate(p: EmailJobPayload): string {
  const num = escapeHtml(p.orderNumber ?? '')
  return `<p>Your payment for order <strong>${num}</strong> could not be processed.</p><p>Please try a different payment method to complete your order.</p>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
