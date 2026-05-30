import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import type { SessionData } from '@ecom/auth/session.service'
import type { CreateAddressDto, UpdateAddressDto } from './dto/address.dto'

const MAX_ADDRESSES_PER_USER = 5

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async listAddresses(user: SessionData) {
    return this.prisma.userAddress.findMany({
      where: { userId: user.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    })
  }

  async createAddress(user: SessionData, dto: CreateAddressDto) {
    const count = await this.prisma.userAddress.count({ where: { userId: user.userId } })

    if (count >= MAX_ADDRESSES_PER_USER) {
      throw new BadRequestException(`Maximum ${MAX_ADDRESSES_PER_USER} addresses allowed`)
    }

    const makeDefault = dto.isDefault ?? count === 0

    return this.prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.userAddress.updateMany({
          where: { userId: user.userId, isDefault: true },
          data: { isDefault: false },
        })
      }

      return tx.userAddress.create({
        data: {
          userId: user.userId,
          recipientName: dto.recipientName,
          phone: dto.phone,
          addressLine: dto.addressLine,
          city: dto.city,
          province: dto.province,
          postalCode: dto.postalCode,
          countryCode: dto.countryCode ?? 'SG',
          label: dto.label ?? null,
          isDefault: makeDefault,
        },
      })
    })
  }

  async updateAddress(user: SessionData, addressId: string, dto: UpdateAddressDto) {
    const address = await this.prisma.userAddress.findUnique({ where: { id: addressId } })

    if (!address) throw new NotFoundException('Address not found')
    if (address.userId !== user.userId) throw new ForbiddenException()

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.userAddress.updateMany({
          where: { userId: user.userId, isDefault: true, id: { not: addressId } },
          data: { isDefault: false },
        })
      }

      return tx.userAddress.update({
        where: { id: addressId },
        data: {
          ...(dto.recipientName !== undefined && { recipientName: dto.recipientName }),
          ...(dto.phone !== undefined && { phone: dto.phone }),
          ...(dto.addressLine !== undefined && { addressLine: dto.addressLine }),
          ...(dto.city !== undefined && { city: dto.city }),
          ...(dto.province !== undefined && { province: dto.province }),
          ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
          ...(dto.countryCode !== undefined && { countryCode: dto.countryCode }),
          ...(dto.label !== undefined && { label: dto.label }),
          ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
        },
      })
    })
  }

  async deleteAddress(user: SessionData, addressId: string) {
    const address = await this.prisma.userAddress.findUnique({ where: { id: addressId } })

    if (!address) throw new NotFoundException('Address not found')
    if (address.userId !== user.userId) throw new ForbiddenException()

    await this.prisma.userAddress.delete({ where: { id: addressId } })

    // Promote oldest remaining address to default if deleted one was default
    if (address.isDefault) {
      const oldest = await this.prisma.userAddress.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: 'asc' },
      })

      if (oldest) {
        await this.prisma.userAddress.update({
          where: { id: oldest.id },
          data: { isDefault: true },
        })
      }
    }
  }
}
