import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { LedgerType, PrismaClient } from '@prisma/client'
import { Job } from 'bullmq'

export interface CommissionJobData {
  orderId: string
}

@Processor('commission')
export class CommissionProcessor extends WorkerHost {
  private readonly logger = new Logger(CommissionProcessor.name)

  constructor(private readonly prisma: PrismaClient) {
    super()
  }

  async process(job: Job<CommissionJobData>): Promise<void> {
    const { orderId } = job.data
    if (!orderId) {
      this.logger.warn(`Commission job ${String(job.id)} missing orderId; skipping`)
      return
    }

    const subOrders = await this.prisma.subOrder.findMany({
      where: { orderId },
      include: { seller: { select: { id: true, commissionRate: true, storeName: true } } },
    })

    if (subOrders.length === 0) {
      this.logger.warn(`No sub-orders for order ${orderId}; skipping`)
      return
    }

    for (const sub of subOrders) {
      const rate = sub.seller.commissionRate
      const amount = Math.round(sub.subtotal * rate * 100) / 100

      const created = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.commission.findUnique({
          where: { orderId_sellerId: { orderId, sellerId: sub.sellerId } },
        })
        if (existing) {
          return false
        }

        const commission = await tx.commission.create({
          data: { orderId, sellerId: sub.sellerId, amount, rate },
        })

        await tx.sellerLedger.create({
          data: {
            sellerId: sub.sellerId,
            type: LedgerType.DEBIT,
            amount,
            referenceType: 'Commission',
            referenceId: commission.id,
            description: `Commission ${(rate * 100).toFixed(1)}% on order ${orderId}`,
          },
        })

        return true
      })

      if (created) {
        this.logger.log(
          `Commission recorded: seller=${sub.sellerId} order=${orderId} amount=${String(amount)}`,
        )
      } else {
        this.logger.log(
          `Commission already exists for order=${orderId} seller=${sub.sellerId}; skipped`,
        )
      }
    }
  }
}
