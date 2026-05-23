import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiAuth, ApiErrorResponses, ApiOkResponseData } from '@ecom/nestjs-core/openapi'
import { CurrentAdmin, type AdminSessionData } from '../auth/decorators/current-admin.decorator'
import { Permissions } from '../auth/decorators/permissions.decorator'
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard'
import { PermissionGuard } from '../auth/guards/permission.guard'
import { AuditLog } from '../common/decorators/audit-log.decorator'
import {
  CommissionRuleResponseDto,
  CreateCommissionRuleDto,
  UpdateCommissionRuleDto,
} from './dto/commission-fees.dto'
import { CommissionFeesService } from './commission-fees.service'

@ApiTags('Admin/CommissionFees')
@Controller('commission-fees')
@UseGuards(AdminAuthGuard, PermissionGuard)
@ApiAuth()
@ApiErrorResponses()
@ApiExtraModels(CommissionRuleResponseDto)
export class CommissionFeesController {
  constructor(private readonly commissionFeesService: CommissionFeesService) {}

  @Get()
  @Permissions('SETTINGS_MANAGE')
  @ApiOperation({ summary: 'List all commission rules' })
  @ApiOkResponseData([CommissionRuleResponseDto])
  async findAll() {
    return this.commissionFeesService.findAll()
  }

  @Post()
  @Permissions('SETTINGS_MANAGE')
  @AuditLog('SETTINGS_CHANGED', 'CommissionRule', {})
  @ApiOperation({ summary: 'Create a commission rule' })
  @ApiOkResponseData(CommissionRuleResponseDto)
  async create(
    @Body() dto: CreateCommissionRuleDto,
    @CurrentAdmin() _admin: AdminSessionData,
  ) {
    return this.commissionFeesService.create(dto)
  }

  @Put(':id')
  @Permissions('SETTINGS_MANAGE')
  @AuditLog('SETTINGS_CHANGED', 'CommissionRule', { entityIdParam: 'id' })
  @ApiOperation({ summary: 'Update a commission rule' })
  @ApiOkResponseData(CommissionRuleResponseDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommissionRuleDto,
    @CurrentAdmin() _admin: AdminSessionData,
  ) {
    return this.commissionFeesService.update(id, dto)
  }
}
