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
