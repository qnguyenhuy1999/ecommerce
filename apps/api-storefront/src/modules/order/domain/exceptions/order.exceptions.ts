export class CartEmptyException extends Error {
  readonly code = 'CART_EMPTY'
  constructor() {
    super('Cart is empty')
  }
}

export class CheckoutProductNotActiveException extends Error {
  readonly code = 'PRODUCT_NOT_ACTIVE'
  constructor() {
    super('One or more cart items are no longer available for purchase')
  }
}

export class CheckoutInsufficientStockException extends Error {
  readonly code = 'INSUFFICIENT_STOCK'
  constructor() {
    super('One or more cart items exceed available stock')
  }
}

export class InvalidOrderStatusTransitionException extends Error {
  readonly code = 'INVALID_STATUS_TRANSITION'
  constructor(current: string, next: string) {
    super(`Cannot transition order from ${current} to ${next}`)
  }
}

export class OrderNotFoundException extends Error {
  readonly code = 'ORDER_NOT_FOUND'
  constructor(id?: string) {
    super(id ? `Order ${id} not found` : 'Order not found')
  }
}

export class SubOrderNotFoundException extends Error {
  readonly code = 'SUB_ORDER_NOT_FOUND'
  constructor(id?: string) {
    super(id ? `Sub-order ${id} not found` : 'Sub-order not found')
  }
}

export class ShippingTrackingRequiredException extends Error {
  readonly code = 'SHIPPING_TRACKING_REQUIRED'
  constructor() {
    super('Shipping tracking (carrier + tracking number) is required to mark a sub-order as SHIPPED')
  }
}
