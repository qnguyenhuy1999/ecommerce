export class UserNotFoundException extends Error {
  readonly code = 'USER_NOT_FOUND'
  constructor(id?: string) {
    super(id ? `User ${id} not found` : 'User not found')
  }
}

export class EmailAlreadyInUseException extends Error {
  readonly code = 'EMAIL_ALREADY_IN_USE'
  constructor(email: string) {
    super(`Email "${email}" is already in use`)
  }
}
