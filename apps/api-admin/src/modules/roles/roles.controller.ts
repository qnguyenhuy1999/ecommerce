import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiAuth } from '@ecom/nestjs-core/openapi/decorators/api-auth.decorator'
import { ApiErrorResponses } from '@ecom/nestjs-core/openapi/decorators/api-error-responses.decorator'
import { ApiOkResponseData } from '@ecom/nestjs-core/openapi/decorators/api-response.decorator'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { AuditLog } from '../../common/decorators/audit-log.decorator'
import { RoleResponseDto, UpdateRolePermissionsDto } from './dto/roles.dto'
import { RolesService } from './roles.service'

@ApiTags('Admin/Roles')
@Controller('roles')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(RoleResponseDto)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('ROLE_MANAGE')
  @ApiOperation({ summary: 'List all roles with permissions and member count' })
  @ApiOkResponseData([RoleResponseDto])
  async findAll() {
    return this.rolesService.findAll()
  }

  @Post(':id/permissions')
  @Permissions('ROLE_MANAGE')
  @AuditLog('ROLE_ASSIGNED', 'AdminRole', { entityIdParam: 'id' })
  @ApiOperation({ summary: 'Replace all permissions for a role' })
  @ApiOkResponseData(RoleResponseDto)
  async updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionsDto,
    @CurrentAdmin() _admin: AdminSessionData,
  ) {
    return this.rolesService.updatePermissions(id, dto)
  }
}
