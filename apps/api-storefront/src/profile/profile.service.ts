import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import type { SessionData } from '@ecom/auth'
import type { UpdateProfileDto } from './dto/profile.dto'

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: SessionData) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    if (!profile) throw new NotFoundException('User not found')
    return profile
  }

  async updateProfile(user: SessionData, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: user.userId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
      },
    })
  }
}
