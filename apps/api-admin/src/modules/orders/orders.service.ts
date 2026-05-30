import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@ecom/database'
import { type OrderStatus, OrderStatus as OS } from '@ecom/contracts/enums/order'
import { buildOffsetResponse } from '@ecom/shared/pagination/prisma/builders'
import { OrdersRepository } from './repositories/orders.repository'

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async findAll(query: {
    page?: number
    limit?: number
    search?: string
    status?: OrderStatus
    buyerId?: string
  }) {
    const { items, total } = await this.ordersRepository.findMany(query)

    return buildOffsetResponse(items, query.page ?? 1, query.limit ?? 20, total)
  }

  async findById(id: string) {
    const order = await this.ordersRepository.findById(id)
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async forceCancel(id: string) {
    const order = await this.findById(id)
    return this.ordersRepository.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.sellerOrder.updateMany({
        where: { orderId: order.id },
        data: { status: OS.CANCELLED },
      })
      return tx.order.update({
        where: { id: order.id },
        data: { status: OS.CANCELLED },
      })
    })
  }

  async forceComplete(id: string) {
    const order = await this.findById(id)
    return this.ordersRepository.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.sellerOrder.updateMany({
        where: { orderId: order.id },
        data: { status: OS.DELIVERED },
      })
      return tx.order.update({
        where: { id: order.id },
        data: { status: OS.DELIVERED },
      })
    })
  }

  async getStatusCounts() {
    const counts = await this.ordersRepository.groupByStatus()
    const result: Record<string, number> = {}
    for (const item of counts) {
      result[item.status] = item._count.status
    }
    return result
  }
}
