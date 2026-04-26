import 'reflect-metadata'

import { buildMessage } from '../../src/processors/email.processor'

describe('email.processor buildMessage', () => {
  it.each([
    'welcome',
    'order-confirmation',
    'seller-approved',
    'payment-failed',
  ])('returns a message for known job %s', (jobName) => {
    const message = buildMessage(jobName, {
      to: 'buyer@example.com',
      orderNumber: 'ORD-1',
      storeName: 'Acme',
      paymentId: 'pay-1',
    })
    expect(message).not.toBeNull()
    expect(message!.to).toBe('buyer@example.com')
    expect(message!.subject).toBeTruthy()
    expect(message!.html).toBeTruthy()
  })

  it('returns null for unknown job names', () => {
    expect(buildMessage('refund-confirmation', { to: 'buyer@example.com' })).toBeNull()
  })

  it('escapes user-controlled strings to prevent HTML injection', () => {
    const message = buildMessage('seller-approved', {
      to: 'buyer@example.com',
      storeName: '<script>alert(1)</script>',
    })
    expect(message!.html).not.toContain('<script>')
    expect(message!.html).toContain('&lt;script&gt;')
  })

  it('renders the order number into the order-confirmation subject', () => {
    const message = buildMessage('order-confirmation', {
      to: 'buyer@example.com',
      orderNumber: 'ORD-20260425-001',
    })
    expect(message!.subject).toContain('ORD-20260425-001')
  })
})
