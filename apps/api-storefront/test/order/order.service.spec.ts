import { InvalidOrderStatusTransitionException } from '../../src/modules/order/domain/exceptions/order.exceptions'
import { OrderService } from '../../src/modules/order/order.service'

describe('OrderService', () => {
  const service = new OrderService()

  it('allows the documented checkout and fulfillment transitions', () => {
    expect(service.canTransition('PENDING_PAYMENT', 'PAID')).toBe(true)
    expect(service.canTransition('PAID', 'PROCESSING')).toBe(true)
    expect(service.canTransition('PROCESSING', 'SHIPPED')).toBe(true)
    expect(service.canTransition('SHIPPED', 'COMPLETED')).toBe(true)
    expect(service.canTransition('PENDING_PAYMENT', 'CANCELLED')).toBe(true)
  })

  it('allows refund paths from paid or processing orders', () => {
    expect(service.canTransition('PAID', 'REFUNDED')).toBe(true)
    expect(service.canTransition('PROCESSING', 'PENDING_REFUND')).toBe(true)
  })

  it('rejects invalid transitions', () => {
    expect(() => {
      service.assertCanTransition('PENDING_PAYMENT', 'SHIPPED')
    }).toThrow(InvalidOrderStatusTransitionException)
  })
})
