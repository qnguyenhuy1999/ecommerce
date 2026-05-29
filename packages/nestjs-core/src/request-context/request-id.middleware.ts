import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import { REQUEST_ID_HEADER } from './request-id.constants'

const requestIds = new WeakMap<Request, string>()

export interface RequestWithRequestId extends Request {
  requestId: string
}

function readRequestIdHeader(request: Request): string | undefined {
  const header = request.headers[REQUEST_ID_HEADER]
  if (Array.isArray(header)) {
    return header[0]
  }
  return typeof header === 'string' ? header : undefined
}

export function getRequestId(request: Request): string | undefined {
  return requestIds.get(request)
}

function attachRequestId(request: Request, requestId: string): void {
  requestIds.set(request, requestId)
  Object.defineProperty(request, 'requestId', {
    value: requestId,
    configurable: true,
    enumerable: false,
    writable: false,
  })
}

export function requestIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const requestId = readRequestIdHeader(request)?.trim() || randomUUID()
  attachRequestId(request, requestId)
  response.setHeader(REQUEST_ID_HEADER, requestId)
  next()
}
