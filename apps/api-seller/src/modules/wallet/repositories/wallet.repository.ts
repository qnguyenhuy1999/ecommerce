import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { offsetPaginate } from '@ecom/shared/pagination/prisma/offset-paginate'

@Injectable()
export class WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findWallet(shopId: string) {
    return this.prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
    })
  }

  async createWallet(shopId: string) {
    return this.prisma.wallet.create({
      data: { ownerId: shopId, ownerType: 'SHOP' },
    })
  }

  async findTransaction(idempotencyKey: string) {
    return this.prisma.walletTransaction.findUnique({ where: { idempotencyKey } })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }

  async findTransactions(walletId: string, page: number, limit: number) {
    return offsetPaginate(this.prisma.walletTransaction, {
      page,
      limit,
      where: { walletId } satisfies Prisma.WalletTransactionWhereInput,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findWithdrawals(walletId: string, page: number, limit: number) {
    return offsetPaginate(this.prisma.walletWithdrawal, {
      page,
      limit,
      where: { walletId } satisfies Prisma.WalletWithdrawalWhereInput,
      orderBy: { createdAt: 'desc' },
    })
  }
}
