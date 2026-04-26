export class SellerNotFoundException extends Error {
  readonly code = 'SELLER_NOT_FOUND'
  constructor(id?: string) {
    super(id ? `Seller ${id} not found` : 'Seller not found')
  }
}

export class SellerAlreadyRegisteredException extends Error {
  readonly code = 'SELLER_ALREADY_REGISTERED'
  constructor() {
    super('User is already registered as a seller')
  }
}

export class StoreNameExistsException extends Error {
  readonly code = 'STORE_NAME_EXISTS'
  constructor(storeName: string) {
    super(`Store name "${storeName}" is already taken`)
  }
}

export class NotSellerOwnerException extends Error {
  readonly code = 'NOT_SELLER_OWNER'
  constructor() {
    super('You do not own this seller profile')
  }
}

export class SellerKycNotPendingException extends Error {
  readonly code = 'SELLER_KYC_NOT_PENDING'
  constructor(currentStatus: string) {
    super(`Seller KYC status must be PENDING to transition (current: ${currentStatus})`)
  }
}
