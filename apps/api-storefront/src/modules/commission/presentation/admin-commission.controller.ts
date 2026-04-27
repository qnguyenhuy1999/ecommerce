import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import { AdminPayoutReportDto } from '../application/dtos/admin-payout-report.dto'
import { AdminPayoutReportQuery } from '../application/queries/admin-payout-report/admin-payout-report.query'
import type { PayoutExportView, PayoutReportPage, PayoutReportRow } from '../application/views/commission.view'

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

  @Get('payout-export')
  @ApiOperation({ summary: 'CSV payout export filtered by date range and/or seller (admin only).' })
  @ApiResponse({ status: 200, description: 'CSV payout export payload.' })
  async payoutExport(@Query() dto: AdminPayoutReportDto): Promise<{ success: true; data: PayoutExportView }> {
    const exportDto = new AdminPayoutReportDto()
    exportDto.page = 1
    exportDto.limit = 100
    exportDto.sellerId = dto.sellerId
    exportDto.from = dto.from
    exportDto.to = dto.to
    const result = await this.queryBus.execute<AdminPayoutReportQuery, PayoutReportPage>(
      new AdminPayoutReportQuery(exportDto),
    )
    const header = ['commissionId', 'orderId', 'sellerId', 'storeName', 'amount', 'rate', 'createdAt']
    const rows = result.data.map((row) => [
      row.commissionId,
      row.orderId,
      row.sellerId,
      row.storeName,
      row.amount.toFixed(2),
      row.rate.toFixed(4),
      row.createdAt,
    ])
    const content = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
    return {
      success: true,
      data: {
        filename: `payout-export-${new Date().toISOString().slice(0, 10)}.csv`,
        contentType: 'text/csv',
        content,
        totalRows: result.data.length,
        totalAmount: result.data.reduce((sum, row) => sum + row.amount, 0),
      },
    }
  }
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}
