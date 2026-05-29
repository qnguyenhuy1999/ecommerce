import type { ApiErrorCode } from './error-code'

export interface ApiErrorBody {
  code: ApiErrorCode
  message: string
  details?: unknown
}

export interface ApiSuccessResponse<T = unknown> {
  success: true
  message?: string
  data: T
  meta?: Record<string, unknown>
  timestamp: string
}

export interface ApiPaginatedSuccessResponse<T = unknown> {
  success: true
  message?: string
  data: { items: T[] }
  meta: PaginationMeta
  timestamp: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiErrorResponse {
  success: false
  message: string
  error: ApiErrorBody
  statusCode: number
  timestamp: string
  path: string
  requestId?: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

export type ApiSuccess<T = unknown> = ApiSuccessResponse<T>
