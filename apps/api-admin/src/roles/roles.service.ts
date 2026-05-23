import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { AdminPermission } from '@ecom/database'
import { UpdateRolePermissionsDto } from './dto/roles.dto'

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const roles = await this.prisma.adminRole.findMany({
      include: {
        permissions: true,
        admins: { select: { adminId: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      memberCount: role.admins.length,
      permissions: role.permissions.map((p) => p.permission),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    }))
  }

  async updatePermissions(roleId: string, dto: UpdateRolePermissionsDto) {
    return this.prisma.$transaction(async (tx) => {
      const role = await tx.adminRole.findUnique({ where: { id: roleId } })
      if (!role) throw new NotFoundException('Role not found')

      await tx.rolePermission.deleteMany({ where: { adminRoleId: roleId } })
      await tx.rolePermission.createMany({
        data: dto.permissions.map((permission: AdminPermission) => ({
          adminRoleId: roleId,
          permission,
        })),
      })

      const updated = await tx.adminRole.findUnique({
        where: { id: roleId },
        include: {
          permissions: true,
          admins: { select: { adminId: true } },
        },
      })
      if (!updated) throw new NotFoundException('Role not found')

      return {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        memberCount: updated.admins.length,
        permissions: updated.permissions.map((p) => p.permission),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      }
    })
  }
}
