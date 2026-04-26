export class ReservationNotFoundException extends Error {
  readonly code = 'RESERVATION_NOT_FOUND'
  constructor(reservationId: string) {
    super(`Reservation ${reservationId} not found`)
  }
}

export class ReservationNotActiveException extends Error {
  readonly code = 'RESERVATION_NOT_ACTIVE'
  constructor(reservationId: string, status: string) {
    super(`Reservation ${reservationId} is not ACTIVE (was ${status})`)
  }
}

export class ReservationStockMismatchException extends Error {
  readonly code = 'RESERVATION_STOCK_MISMATCH'
  constructor() {
    super('Underlying variant stock does not match the reservation; cannot transition')
  }
}

export class VariantNotFoundException extends Error {
  readonly code = 'VARIANT_NOT_FOUND'
  constructor(variantId: string) {
    super(`Variant ${variantId} not found`)
  }
}

export class StockAdjustmentInvalidException extends Error {
  readonly code = 'STOCK_ADJUSTMENT_INVALID'
  constructor(reason: string) {
    super(`Stock adjustment rejected: ${reason}`)
  }
}
