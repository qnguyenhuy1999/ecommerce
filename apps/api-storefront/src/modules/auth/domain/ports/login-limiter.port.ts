export const LOGIN_LIMITER = Symbol('LOGIN_LIMITER')

export interface ILoginLimiter {
  recordFailure(email: string): Promise<number>
  isLocked(email: string): Promise<boolean>
  reset(email: string): Promise<void>
}
