import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

@Injectable()
export class InventoryService {
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
}
