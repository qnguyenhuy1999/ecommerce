/**
 * Base application error class.
 * All domain-specific errors extend this.
 * The `code` field maps to the `ApiErrorResponse.error.code` in the API response.
 */
export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(
    message: string,
    options: {
      code?: string
      statusCode?: number
      details?: unknown
      cause?: Error
    } = {},
  ) {
    super(message)
    this.name = 'AppError'
    this.code = options.code ?? 'APP_ERROR'
    this.statusCode = options.statusCode ?? 500
    this.details = options.details
    if (options.cause) {
      Object.defineProperty(this, 'cause', {
        value: options.cause,
        configurable: true,
        writable: false,
      })
    }
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
