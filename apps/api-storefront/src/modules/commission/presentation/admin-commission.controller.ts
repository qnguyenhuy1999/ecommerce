import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import { AdminPayoutReportDto } from '../application/dtos/admin-payout-report.dto'
import { AdminPayoutReportQuery } from '../application/queries/admin-payout-report/admin-payout-report.query'
import type { PayoutReportPage, PayoutReportRow } from '../application/views/commission.view'

interface PaginatedPayoutReport {
  success: true
  data: PayoutReportRow[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

@ApiTags('admin')
@Controller('admin/commissions')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('access_token')
export class AdminCommissionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('payout-report')
  @ApiOperation({ summary: 'Payout report filtered by date range and/or seller (admin only).' })
  @ApiResponse({ status: 200, description: 'Paginated payout report.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  async payoutReport(@Query() dto: AdminPayoutReportDto): Promise<PaginatedPayoutReport> {
    const result = await this.queryBus.execute<AdminPayoutReportQuery, PayoutReportPage>(
      new AdminPayoutReportQuery(dto),
    )
    return {
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    }
  }
}
