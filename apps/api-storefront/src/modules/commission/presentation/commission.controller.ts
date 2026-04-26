import { Controller, ForbiddenException, Get, Query, UseGuards } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard } from '@ecom/nest-auth'

import { ListSellerLedgerDto } from '../application/dtos/list-seller-ledger.dto'
import { ListSellerLedgerQuery } from '../application/queries/list-seller-ledger/list-seller-ledger.query'
import type { SellerLedgerPage, SellerLedgerView } from '../application/views/commission.view'

interface PaginatedLedger {
  success: true
  data: SellerLedgerView[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

@ApiTags('commissions')
@Controller('sellers/me/ledger')
@UseGuards(JwtAccessGuard)
@ApiCookieAuth('access_token')
export class CommissionController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly prisma: PrismaClient,
  ) {}

  @Get()
  @ApiOperation({ summary: "List the authenticated seller's ledger entries, newest first." })
  @ApiResponse({ status: 200, description: 'Paginated seller ledger.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token.' })
  @ApiResponse({ status: 403, description: 'User is not a seller.' })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: ListSellerLedgerDto,
  ): Promise<PaginatedLedger> {
    const seller = await this.prisma.seller.findUnique({
      where: { userId: user.userId },
      select: { id: true },
    })
    if (!seller) {
      throw new ForbiddenException('NOT_A_SELLER')
    }

    const result = await this.queryBus.execute<ListSellerLedgerQuery, SellerLedgerPage>(
      new ListSellerLedgerQuery(seller.id, dto),
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
