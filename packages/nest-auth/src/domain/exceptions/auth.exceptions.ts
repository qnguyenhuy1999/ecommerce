export class InvalidCredentialsException extends Error {
  constructor() {
    super('Invalid email or password')
  }
}
export class AccountSuspendedException extends Error {
  constructor() {
    super('Account is suspended')
  }
}
export class TokenExpiredException extends Error {
  constructor() {
    super('Token has expired')
  }
}
export class TokenReusedException extends Error {
  constructor() {
    super('Refresh token reuse detected — all sessions revoked')
  }
}
export class EmailAlreadyExistsException extends Error {
  constructor() {
    super('Email is already registered')
  }
}
