import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaClient, IdempotencyStatus, type Prisma } from '@prisma/client'
import type { Request, Response } from 'express'
import { createHash } from 'node:crypto'
import { Observable, from, of } from 'rxjs'
import { catchError, mergeMap, tap } from 'rxjs/operators'

import {
  IDEMPOTENCY_HEADER,
  IdempotencyKeyInvalidError,
  assertValidIdempotencyKey,
  canonicalStringify,
  computeExpiresAt,
} from '@ecom/shared'

import {
  IDEMPOTENT_METADATA_KEY,
  type IdempotentOptions,
} from '../decorators/idempotent.decorator'

// Conservative default for reclaiming a crashed in-flight request. Long enough
// to outlive a reasonable upstream timeout, short enough that a real stuck
// client doesn't block retries forever.
const IN_FLIGHT_LOCK_MS = 30_000

interface AuthenticatedRequest extends Request {
  user?: { id?: string; userId?: string }
}

/**
 * IdempotencyInterceptor
 *
 * Implements the "at-most-once" pattern for write endpoints:
 *   1. First request with a given key acquires the row (IN_PROGRESS) and runs.
 *   2. Retry with the same key + same body replays the stored response.
 *   3. Retry with the same key + different body returns 422 (client bug).
 *   4. Concurrent retry while the first is still executing returns 409.
 *
 * Enable per-route via `@Idempotent()` from ./decorators/idempotent.decorator.
 * Zero-impact on routes that do not opt in.
 *
 * NOTE: The actual handler and the idempotency record are NOT updated in the
 * same DB transaction here — the simplicity of storing request/response is
 * worth the tradeoff. For webhook endpoints that must be truly atomic, use
 * the Outbox pattern inside the handler instead.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly logger = new Logger(IdempotencyInterceptor.name)

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaClient,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<IdempotentOptions | undefined>(
      IDEMPOTENT_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!options) {
      return next.handle()
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const res = context.switchToHttp().getResponse<Response>()

    const rawKey = extractHeader(req, IDEMPOTENCY_HEADER)
    if (!rawKey) {
      if (options.required === false) {
        return next.handle()
      }
      throw new BadRequestException(`Missing required ${IDEMPOTENCY_HEADER} header`)
    }

    try {
      assertValidIdempotencyKey(rawKey)
    } catch (err) {
      if (err instanceof IdempotencyKeyInvalidError) {
        throw new BadRequestException(err.message)
      }
      throw err
    }

    const method = req.method.toUpperCase()
    // `originalUrl` includes the query string; strip it so idempotency scope is
    // by route, not by query params. Still include `route.path` if available.
    const routePath: string = (req as unknown as { route?: { path?: string } }).route?.path ?? req.path
    const userId = req.user?.userId ?? req.user?.id ?? null
    const requestHash = hashBody(req.body)

    return from(
      this.reserveOrReplay({
        key: rawKey,
        userId,
        method,
        path: routePath,
        requestHash,
        ttlMs: options.ttlMs,
      }),
    ).pipe(
      mergeMap((reservation) => {
        if (reservation.kind === 'replay') {
          // Restore the stored response. Express handles content-negotiation
          // downstream, so emitting the parsed body through rxjs is safe.
          res.status(reservation.statusCode)
          return of(reservation.body)
        }
        // First run: actually execute the handler, then persist the result.
        return next.handle().pipe(
          tap((body: unknown) => {
            // Use the response's current status (handler may have changed it
            // via @HttpCode or res.status()) and fall back to 200.
            const statusCode = res.statusCode || 200
            void this.markCompleted(reservation.recordId, statusCode, body)
          }),
          catchError((err: unknown) => {
            void this.markFailed(reservation.recordId)
            throw err
          }),
        )
      }),
    )
  }

  private async reserveOrReplay(input: {
    key: string
    userId: string | null
    method: string
    path: string
    requestHash: string
    ttlMs?: number
  }): Promise<
    | { kind: 'reserved'; recordId: string }
    | { kind: 'replay'; statusCode: number; body: unknown }
  > {
    const now = new Date()
    const expiresAt = computeExpiresAt(input.ttlMs, now)
    const lockedUntil = new Date(now.getTime() + IN_FLIGHT_LOCK_MS)

    // Attempt to create the reservation row. The @@unique on
    // (key, userId, method, path) is the concurrency boundary.
    try {
      const created = await this.prisma.idempotencyKey.create({
        data: {
          key: input.key,
          userId: input.userId,
          method: input.method,
          path: input.path,
          requestHash: input.requestHash,
          status: IdempotencyStatus.IN_PROGRESS,
          lockedUntil,
          expiresAt,
        },
      })
      return { kind: 'reserved', recordId: created.id }
    } catch (err) {
      if (!isUniqueViolation(err)) {
        throw err
      }
    }

    // A row already exists for this (key, userId, method, path). Inspect it.
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: {
        key_userId_method_path: {
          key: input.key,
          userId: input.userId ?? '',
          method: input.method,
          path: input.path,
        },
      },
    })

    if (!existing) {
      // Race: row vanished between create-fail and lookup (another worker
      // expired it). Safest is to ask the client to retry.
      throw new ConflictException(
        'Idempotency record is unavailable; please retry with the same key',
      )
    }

    if (existing.requestHash !== input.requestHash) {
      throw new UnprocessableEntityException(
        `Idempotency-Key was reused with a different request body`,
      )
    }

    if (existing.status === IdempotencyStatus.IN_PROGRESS) {
      const stillLocked =
        existing.lockedUntil !== null && existing.lockedUntil.getTime() > now.getTime()
      if (stillLocked) {
        throw new ConflictException(
          'A request with this Idempotency-Key is already in progress',
        )
      }
      // Lock expired — the previous attempt likely crashed. Take over.
      await this.prisma.idempotencyKey.update({
        where: { id: existing.id },
        data: { lockedUntil: new Date(now.getTime() + IN_FLIGHT_LOCK_MS) },
      })
      return { kind: 'reserved', recordId: existing.id }
    }

    // COMPLETED or FAILED: replay the stored outcome.
    return {
      kind: 'replay',
      statusCode: existing.statusCode ?? 200,
      body: existing.responseBody,
    }
  }

  private async markCompleted(
    recordId: string,
    statusCode: number,
    body: unknown,
  ): Promise<void> {
    try {
      await this.prisma.idempotencyKey.update({
        where: { id: recordId },
        data: {
          status: IdempotencyStatus.COMPLETED,
          statusCode,
          responseBody: safeJson(body),
          lockedUntil: null,
        },
      })
    } catch (err) {
      // Best-effort: failing to persist the response merely means the next
      // retry will re-run the handler. Log and move on.
      this.logger.warn(
        `Failed to persist idempotency completion for ${recordId}: ${stringifyError(err)}`,
      )
    }
  }

  private async markFailed(recordId: string): Promise<void> {
    try {
      await this.prisma.idempotencyKey.update({
        where: { id: recordId },
        data: {
          status: IdempotencyStatus.FAILED,
          lockedUntil: null,
        },
      })
    } catch (err) {
      this.logger.warn(
        `Failed to persist idempotency failure for ${recordId}: ${stringifyError(err)}`,
      )
    }
  }
}

function extractHeader(req: Request, name: string): string | null {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()]
  if (Array.isArray(value)) return value[0] ?? null
  if (typeof value === 'string') return value
  return null
}

function hashBody(body: unknown): string {
  return createHash('sha256').update(canonicalStringify(body ?? null)).digest('hex')
}

function isUniqueViolation(err: unknown): boolean {
  // Prisma surfaces P2002 for unique-constraint violations. We check loosely
  // to avoid a hard compile-time dependency on the error class shape.
  if (typeof err !== 'object' || err === null) return false
  const code = (err as { code?: unknown }).code
  return code === 'P2002'
}

function safeJson(value: unknown): Prisma.InputJsonValue {
  // Prisma's Json column rejects `undefined` and non-serializable values.
  // Round-trip through JSON to normalize; fall back to null on failure.
  try {
    return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue
  } catch {
    return null as unknown as Prisma.InputJsonValue
  }
}

function stringifyError(err: unknown): string {
  if (err instanceof Error) return err.message
  return String(err)
}
