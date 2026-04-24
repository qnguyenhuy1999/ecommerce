export class ProductNotFoundException extends Error {
  readonly code = 'PRODUCT_NOT_FOUND'
  constructor(id?: string) {
    super(id ? `Product ${id} not found` : 'Product not found')
  }
}

export class NotProductOwnerException extends Error {
  readonly code = 'NOT_PRODUCT_OWNER'
  constructor() {
    super('You do not own this product')
  }
}

export class SellerNotFoundException extends Error {
  readonly code = 'SELLER_NOT_FOUND'
  constructor() {
    super('Authenticated user is not a registered seller')
  }
}

export class KycNotApprovedException extends Error {
  readonly code = 'KYC_NOT_APPROVED'
  constructor() {
    super('Seller KYC must be approved before publishing products')
  }
}

export class SkuExistsException extends Error {
  readonly code = 'SKU_EXISTS'
  constructor(sku: string) {
    super(`A product with SKU "${sku}" already exists for this seller`)
  }
}

export class CategoryNotFoundException extends Error {
  readonly code = 'CATEGORY_NOT_FOUND'
  constructor() {
    super('Referenced category does not exist')
  }
}

export class InvalidPriceRangeException extends Error {
  readonly code = 'INVALID_PRICE_RANGE'
  constructor() {
    super('minPrice must not exceed maxPrice')
  }
}
