import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'

const SESSION_INCLUDE = {
  distributionLogs: { orderBy: { createdAt: 'asc' as const } },
} as const

@Injectable()
export class CheckoutRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartWithItems(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                shopId: true,
                basePrice: true,
                baseStock: true,
                reservedStock: true,
                hasVariants: true,
                status: true,
                deletedAt: true,
              },
            },
            variant: {
              select: {
                id: true,
                price: true,
                stock: true,
                reservedStock: true,
                isActive: true,
              },
            },
          },
        },
      },
    })
  }

  async findSession(sessionId: string) {
    return this.prisma.checkoutSession.findUnique({
      where: { id: sessionId },
      include: SESSION_INCLUDE,
    })
  }

  async findSessionByOrder(orderId: string, userId: string) {
    return this.prisma.checkoutSession.findFirst({
      where: { orderId, userId },
      include: {
        distributionLogs: { orderBy: { createdAt: 'asc' } },
      },
    })
  }

  async createSession(data: Prisma.CheckoutSessionCreateInput) {
    return this.prisma.checkoutSession.create({ data, include: SESSION_INCLUDE })
  }

  async updateSession(sessionId: string, data: Prisma.CheckoutSessionUpdateInput) {
    return this.prisma.checkoutSession.update({
      where: { id: sessionId },
      data,
      include: SESSION_INCLUDE,
    })
  }

  async findUserAddress(addressId: string) {
    return this.prisma.userAddress.findUnique({ where: { id: addressId } })
  }

  async findShippingMethod(shopId: string, providerId: string) {
    return this.prisma.sellerShippingMethod.findFirst({
      where: { shopId, providerId, isEnabled: true },
    })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }
}
