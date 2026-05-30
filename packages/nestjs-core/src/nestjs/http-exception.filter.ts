import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { API_ERROR_CODE, isApiErrorCode, type ApiErrorCode } from '@ecom/contracts/http/error-code'
import type { ApiErrorBody, ApiErrorResponse } from '@ecom/contracts/http/response'
import type { Request, Response } from 'express'
import { getRequestId } from '../request-context'

/** Duck-typed shape of our AppError from @ecom/shared/errors. */
interface AppErrorLike extends Error {
  code: string
  statusCode: number
  details?: unknown
}

function isAppError(err: unknown): err is AppErrorLike {
  if (!(err instanceof Error)) return false
  const candidate = err as Partial<AppErrorLike>
  return typeof candidate.code === 'string' && typeof candidate.statusCode === 'number'
}

/** Duck-typed shape of a Prisma known request error (avoids importing @ecom/database). */
interface PrismaKnownError extends Error {
  code: string
  meta?: Record<string, unknown>
}

function isPrismaKnownError(err: unknown): err is PrismaKnownError {
  if (!(err instanceof Error)) return false
  const candidate = err as Partial<PrismaKnownError>
  return typeof candidate.code === 'string' && /^P\d{4}$/.test(candidate.code)
}

function isPrismaValidationError(err: unknown): err is Error {
  return err instanceof Error && err.constructor.name === 'PrismaClientValidationError'
}

/** Map common Prisma error codes to HTTP status + canonical error code. */
function mapPrismaError(err: PrismaKnownError): {
  status: number
  code: ApiErrorCode
  message: string
  details?: unknown
} {
  switch (err.code) {
    case 'P2002':
      return {
        status: HttpStatus.CONFLICT,
        code: API_ERROR_CODE.UNIQUE_CONSTRAINT_VIOLATION,
        message: 'A record with the given data already exists.',
        details: err.meta,
      }
    case 'P2025':
      return {
        status: HttpStatus.NOT_FOUND,
        code: API_ERROR_CODE.RECORD_NOT_FOUND,
        message: 'The requested record was not found.',
        details: err.meta,
      }
    case 'P2003':
      return {
        status: HttpStatus.BAD_REQUEST,
        code: API_ERROR_CODE.FOREIGN_KEY_CONSTRAINT_VIOLATION,
        message: 'A related record was not found.',
        details: err.meta,
      }
    case 'P2014':
      return {
        status: HttpStatus.BAD_REQUEST,
        code: API_ERROR_CODE.RELATION_VIOLATION,
        message: 'The change would violate a required relation.',
        details: err.meta,
      }
    default:
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: API_ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'A database error occurred.',
      }
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const timestamp = new Date().toISOString()
    const path = request?.url ?? ''
    const requestId = getRequestId(request)

    const { status, code, message, details } = this.mapException(exception)
    const error: ApiErrorBody = { code, message }

    if (details !== undefined) {
      error.details = details
    }

    const body: ApiErrorResponse = {
      success: false,
      message,
      error,
      statusCode: status,
      timestamp,
      path,
    }

    if (requestId) {
      body.requestId = requestId
    }

    response.status(status).json(body)
  }

  private mapException(exception: unknown): {
    status: number
    code: ApiErrorCode
    message: string
    details?: unknown
  } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception)
    } else if (isAppError(exception)) {
      return this.handleAppError(exception)
    } else if (isPrismaKnownError(exception)) {
      return mapPrismaError(exception)
    } else if (isPrismaValidationError(exception)) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: API_ERROR_CODE.PRISMA_VALIDATION_ERROR,
        message: 'Invalid query parameters.',
      }
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack)
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: API_ERROR_CODE.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }
  }

  private handleHttpException(exception: HttpException) {
    const status = exception.getStatus()
    const statusCodeName = HttpStatus[status]
    const code =
      typeof statusCodeName === 'string' && isApiErrorCode(statusCodeName)
        ? statusCodeName
        : API_ERROR_CODE.INTERNAL_SERVER_ERROR
    const body = exception.getResponse()

    let message = 'Internal server error'
    let details: unknown

    if (typeof body === 'string') {
      message = body
    } else if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>
      if (Array.isArray(obj.message)) {
        details = obj.message
        message = 'Validation failed'
      } else if (typeof obj.message === 'string') {
        message = obj.message
      }
      if (obj.errors !== undefined) {
        details = obj.errors
      }
    }

    return { status, code, message, details }
  }

  private handleAppError(exception: AppErrorLike) {
    const { statusCode: status, code, message, details } = exception
    if (status >= 500) {
      this.logger.error(message, exception.stack)
    }
    return {
      status,
      code: isApiErrorCode(code) ? code : API_ERROR_CODE.APP_ERROR,
      message,
      details,
    }
  }
}
