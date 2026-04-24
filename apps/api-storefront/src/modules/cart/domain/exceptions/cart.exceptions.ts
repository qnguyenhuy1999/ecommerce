export class VariantNotFoundException extends Error {
  readonly code = 'VARIANT_NOT_FOUND'
  constructor() {
    super('Product variant not found')
  }
}

export class ProductNotActiveException extends Error {
  readonly code = 'PRODUCT_NOT_ACTIVE'
  constructor() {
    super('Product is not available for purchase')
  }
}

export class InsufficientStockException extends Error {
  readonly code = 'INSUFFICIENT_STOCK'
  constructor() {
    super('Requested quantity exceeds available stock')
  }
}

export class InvalidQuantityException extends Error {
  readonly code = 'INVALID_QUANTITY'
  constructor() {
    super('Quantity must be at least 1')
  }
}

export class CartItemNotFoundException extends Error {
  readonly code = 'CART_ITEM_NOT_FOUND'
  constructor() {
    super('Cart item not found')
  }
}

export class NotCartOwnerException extends Error {
  readonly code = 'NOT_CART_OWNER'
  constructor() {
    super('Cart item does not belong to the current user')
  }
}
