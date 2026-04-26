import { Inject, Injectable, Logger } from '@nestjs/common'
import { Prisma, PrismaClient, ReservationStatus } from '@prisma/client'

import {
  ReservationNotActiveException,
  ReservationNotFoundException,
  ReservationStockMismatchException,
  StockAdjustmentInvalidException,
  VariantNotFoundException,
} from './domain/exceptions/inventory.exceptions'

const DEFAULT_LOW_STOCK_THRESHOLD = 10
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

export interface LowStockVariantView {
  variantId: string
  productId: string
  productName: string
  sellerId: string
  storeName: string
  sku: string
  stock: number
  reservedStock: number
  availableStock: number
}

export interface PaginatedView<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ReservationView {
  id: string
  variantId: string
  orderId: string
  quantity: number
  status: ReservationStatus
  expiresAt: string
  createdAt: string
}

export interface AdjustStockResult {
  variantId: string
  previousStock: number
  newStock: number
  reservedStock: number
  availableStock: number
  delta: number
}

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name)

  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async reserveVariant(
    tx: Prisma.TransactionClient,
    input: { variantId: string; orderId: string; quantity: number; expiresAt: Date },
  ): Promise<boolean> {
    const affectedRows = await tx.$executeRaw(
      Prisma.sql`
        UPDATE product_variants
        SET reserved_stock = reserved_stock + ${input.quantity},
            updated_at = NOW()
        WHERE id = ${input.variantId}
          AND stock - reserved_stock >= ${input.quantity}
      `,
    )

    if (affectedRows !== 1) return false

    await tx.inventoryReservation.create({
      data: {
        variantId: input.variantId,
        orderId: input.orderId,
        quantity: input.quantity,
        expiresAt: input.expiresAt,
        status: 'ACTIVE',
      },
    })

    return true
  }

  async listLowStock(input: {
    threshold?: number
    page?: number
    limit?: number
  }): Promise<PaginatedView<LowStockVariantView>> {
    const threshold = input.threshold ?? DEFAULT_LOW_STOCK_THRESHOLD
    const { page, limit, skip } = this.normalizePagination(input.page, input.limit)

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.$queryRaw<
        Array<{
          variant_id: string
          product_id: string
          product_name: string
          seller_id: string
          store_name: string
          sku: string
          stock: number
          reserved_stock: number
          available_stock: number
        }>
      >(Prisma.sql`
        SELECT
          v.id              AS variant_id,
          p.id              AS product_id,
          p.name            AS product_name,
          s.id              AS seller_id,
          s.store_name      AS store_name,
          v.sku             AS sku,
          v.stock           AS stock,
          v.reserved_stock  AS reserved_stock,
          (v.stock - v.reserved_stock) AS available_stock
        FROM product_variants v
        INNER JOIN products p ON p.id = v.product_id AND p.deleted_at IS NULL
        INNER JOIN sellers s ON s.id = p.seller_id
        WHERE (v.stock - v.reserved_stock) <= ${threshold}
        ORDER BY (v.stock - v.reserved_stock) ASC, v.id ASC
        LIMIT ${limit} OFFSET ${skip}
      `),
      this.prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`
        SELECT COUNT(*)::bigint AS count
        FROM product_variants v
        INNER JOIN products p ON p.id = v.product_id AND p.deleted_at IS NULL
        WHERE (v.stock - v.reserved_stock) <= ${threshold}
      `),
    ])

    const totalCount = Number(total[0]?.count ?? 0n)
    return {
      data: rows.map((row) => ({
        variantId: row.variant_id,
        productId: row.product_id,
        productName: row.product_name,
        sellerId: row.seller_id,
        storeName: row.store_name,
        sku: row.sku,
        stock: row.stock,
        reservedStock: row.reserved_stock,
        availableStock: row.available_stock,
      })),
      page,
      limit,
      total: totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    }
  }

  async listReservations(input: {
    variantId?: string
    orderId?: string
    status?: ReservationStatus
    page?: number
    limit?: number
  }): Promise<PaginatedView<ReservationView>> {
    const { page, limit, skip } = this.normalizePagination(input.page, input.limit)
    const where: Prisma.InventoryReservationWhereInput = {
      ...(input.variantId ? { variantId: input.variantId } : {}),
      ...(input.orderId ? { orderId: input.orderId } : {}),
      ...(input.status ? { status: input.status } : {}),
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.inventoryReservation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.inventoryReservation.count({ where }),
    ])

    return {
      data: rows.map(
        (row): ReservationView => ({
          id: row.id,
          variantId: row.variantId,
          orderId: row.orderId,
          quantity: row.quantity,
          status: row.status,
          expiresAt: row.expiresAt.toISOString(),
          createdAt: row.createdAt.toISOString(),
        }),
      ),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }

  async adjustStock(input: {
    variantId: string
    delta: number
    adminUserId: string
    reason?: string
  }): Promise<AdjustStockResult> {
    if (input.delta === 0) {
      throw new StockAdjustmentInvalidException('delta must be non-zero')
    }

    return this.prisma.$transaction(async (tx) => {
      // Atomic write-then-read: a single conditional UPDATE applies the delta
      // only when the resulting stock stays non-negative and >= reserved_stock.
      // RETURNING gives us both the post-update view and (via a CTE) the
      // previous stock so we don't need a separate read that would race with
      // concurrent adjustments under READ COMMITTED.
      const rows = await tx.$queryRaw<
        Array<{
          id: string
          stock: number
          reserved_stock: number
          previous_stock: number
        }>
      >(Prisma.sql`
        WITH prev AS (
          SELECT id, stock AS previous_stock
          FROM product_variants
          WHERE id = ${input.variantId}
          FOR UPDATE
        )
        UPDATE product_variants v
        SET stock = v.stock + ${input.delta},
            updated_at = NOW()
        FROM prev
        WHERE v.id = prev.id
          AND v.stock + ${input.delta} >= 0
          AND v.stock + ${input.delta} >= v.reserved_stock
        RETURNING v.id, v.stock, v.reserved_stock, prev.previous_stock
      `)

      if (rows.length === 0) {
        // Either the variant doesn't exist or the delta would violate the
        // invariants. Disambiguate with a follow-up read so the API surfaces
        // the most informative exception.
        const exists = await tx.productVariant.findUnique({
          where: { id: input.variantId },
          select: { id: true, stock: true, reservedStock: true },
        })
        if (!exists) {
          throw new VariantNotFoundException(input.variantId)
        }
        const projected = exists.stock + input.delta
        if (projected < 0) {
          throw new StockAdjustmentInvalidException(
            `delta ${String(input.delta)} would leave stock negative`,
          )
        }
        throw new StockAdjustmentInvalidException(
          `delta ${String(input.delta)} would leave stock (${String(projected)}) below reserved (${String(exists.reservedStock)})`,
        )
      }

      const updated = rows[0]

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'InventoryReservation',
          aggregateId: updated.id,
          eventType: 'inventory.adjusted',
          payload: this.toJson({
            variantId: updated.id,
            delta: input.delta,
            previousStock: updated.previous_stock,
            newStock: updated.stock,
            adminUserId: input.adminUserId,
            reason: input.reason ?? null,
          }),
        },
      })

      this.logger.log(
        `Stock adjusted by admin ${input.adminUserId}: variant=${updated.id} delta=${String(input.delta)} ${String(updated.previous_stock)}->${String(updated.stock)}`,
      )

      return {
        variantId: updated.id,
        previousStock: updated.previous_stock,
        newStock: updated.stock,
        reservedStock: updated.reserved_stock,
        availableStock: updated.stock - updated.reserved_stock,
        delta: input.delta,
      }
    })
  }

  async confirmReservation(reservationId: string): Promise<ReservationView> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await this.loadActiveReservation(tx, reservationId)

      const affected = await tx.$executeRaw(
        Prisma.sql`
          UPDATE product_variants
          SET stock = stock - ${reservation.quantity},
              reserved_stock = reserved_stock - ${reservation.quantity},
              updated_at = NOW()
          WHERE id = ${reservation.variantId}
            AND stock >= ${reservation.quantity}
            AND reserved_stock >= ${reservation.quantity}
        `,
      )
      if (affected !== 1) throw new ReservationStockMismatchException()

      const updated = await tx.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: 'CONFIRMED' },
      })
      return this.toReservationView(updated)
    })
  }

  async releaseReservation(reservationId: string): Promise<ReservationView> {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await this.loadActiveReservation(tx, reservationId)

      const affected = await tx.$executeRaw(
        Prisma.sql`
          UPDATE product_variants
          SET reserved_stock = reserved_stock - ${reservation.quantity},
              updated_at = NOW()
          WHERE id = ${reservation.variantId}
            AND reserved_stock >= ${reservation.quantity}
        `,
      )
      if (affected !== 1) throw new ReservationStockMismatchException()

      const updated = await tx.inventoryReservation.update({
        where: { id: reservation.id },
        data: { status: 'EXPIRED' },
      })
      return this.toReservationView(updated)
    })
  }

  private async loadActiveReservation(tx: Prisma.TransactionClient, reservationId: string) {
    const reservation = await tx.inventoryReservation.findUnique({
      where: { id: reservationId },
    })
    if (!reservation) throw new ReservationNotFoundException(reservationId)
    if (reservation.status !== 'ACTIVE') {
      throw new ReservationNotActiveException(reservationId, reservation.status)
    }
    return reservation
  }

  private toReservationView(row: {
    id: string
    variantId: string
    orderId: string
    quantity: number
    status: ReservationStatus
    expiresAt: Date
    createdAt: Date
  }): ReservationView {
    return {
      id: row.id,
      variantId: row.variantId,
      orderId: row.orderId,
      quantity: row.quantity,
      status: row.status,
      expiresAt: row.expiresAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    }
  }

  private normalizePagination(page?: number, limit?: number) {
    const safePage = Math.max(1, Math.floor(page ?? 1))
    const safeLimit = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(limit ?? DEFAULT_PAGE_SIZE)))
    return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit }
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
  }
}
