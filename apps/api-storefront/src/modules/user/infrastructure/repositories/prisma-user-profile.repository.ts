import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import type { UserRole, UserStatus } from '@ecom/nest-auth'

import type { UserProfileView } from '../../application/views/user-profile.view'
import type {
  IUserProfileRepository,
  UpdateUserProfileInput,
} from '../../domain/ports/user-profile.repository.port'

const PROFILE_SELECT = {
  id: true,
  email: true,
  role: true,
  status: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
} as const

interface ProfileRow {
  id: string
  email: string
  role: string
  status: string
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class PrismaUserProfileRepository implements IUserProfileRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findProfile(userId: string): Promise<UserProfileView | null> {
    const row = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PROFILE_SELECT,
    })
    return row ? this.toView(row) : null
  }

  async updateProfile(userId: string, data: UpdateUserProfileInput): Promise<UserProfileView> {
    const row = await this.prisma.user.update({
      where: { id: userId },
      // Changing email invalidates the prior verification; force re-verification.
      data: {
        ...(data.email !== undefined ? { email: data.email, emailVerified: null } : {}),
      },
      select: PROFILE_SELECT,
    })
    return this.toView(row)
  }

  async emailTaken(email: string, excludeUserId: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email, NOT: { id: excludeUserId } },
    })
    return count > 0
  }

  private toView(row: ProfileRow): UserProfileView {
    return {
      id: row.id,
      email: row.email,
      role: row.role as UserRole,
      status: row.status as UserStatus,
      emailVerified: row.emailVerified !== null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }
  }
}
