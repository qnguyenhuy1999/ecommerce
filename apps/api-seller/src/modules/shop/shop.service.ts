import { Injectable, NotFoundException } from '@nestjs/common'
import { type Prisma } from '@ecom/database'
import { UpdateShopDto } from './dto/update-shop.dto'
import { ShopRepository } from './repositories/shop.repository'

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}

  async getShop(userId: string) {
    const profile = await this.shopRepository.findProfileWithShop(userId)

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found. Please complete registration.')
    }

    return profile.shop
  }

  async updateShop(userId: string, dto: UpdateShopDto) {
    const profile = await this.shopRepository.findProfileWithShop(userId)

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found')
    }

    const data: Prisma.ShopUpdateInput = {}
    if (dto.name !== undefined) data.name = dto.name
    if (dto.description !== undefined) data.description = dto.description
    if (dto.phone !== undefined) data.phone = dto.phone
    if (dto.email !== undefined) data.email = dto.email
    if (dto.logo !== undefined) data.logo = dto.logo
    if (dto.banner !== undefined) data.banner = dto.banner
    if (dto.addressLine1 !== undefined) data.addressLine1 = dto.addressLine1
    if (dto.addressLine2 !== undefined) data.addressLine2 = dto.addressLine2
    if (dto.city !== undefined) data.city = dto.city
    if (dto.state !== undefined) data.state = dto.state
    if (dto.postalCode !== undefined) data.postalCode = dto.postalCode
    if (dto.country !== undefined) data.country = dto.country

    return this.shopRepository.updateShop(profile.shop.id, data)
  }

  async getShopId(userId: string): Promise<string> {
    const profile = await this.shopRepository.findProfileShopId(userId)

    if (!profile?.shop) {
      throw new NotFoundException('Shop not found')
    }

    return profile.shop.id
  }
}
