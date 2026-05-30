import type { ApiSuccessResponse } from '@ecom/contracts/http/response'

export type TypedApiResponse<T> = ApiSuccessResponse<T>

export type TypedApiSuccess = ApiSuccessResponse<never>
