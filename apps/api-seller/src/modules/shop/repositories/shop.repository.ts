import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'

@Injectable()
export class ShopRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProfileWithShop(userId: string) {
    return this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: true },
    })
  }

  async findProfileShopId(userId: string) {
    return this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { shop: { select: { id: true } } },
    })
  }

  async updateShop(shopId: string, data: Prisma.ShopUpdateInput) {
    return this.prisma.shop.update({
      where: { id: shopId },
      data,
    })
  }
}
