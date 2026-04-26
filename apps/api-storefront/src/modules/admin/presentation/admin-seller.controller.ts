import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import { ApproveSellerCommand } from '../../seller/application/commands/approve-seller/approve-seller.command'
import { RejectSellerCommand } from '../../seller/application/commands/reject-seller/reject-seller.command'
import { ListAdminSellersDto } from '../../seller/application/dtos/list-admin-sellers.dto'
import { RejectSellerDto } from '../../seller/application/dtos/reject-seller.dto'
import { GetSellerQuery } from '../../seller/application/queries/get-seller/get-seller.query'
import { ListAdminSellersQuery } from '../../seller/application/queries/list-admin-sellers/list-admin-sellers.query'
import type {
  AdminSellerDetailView,
  AdminSellerListPage,
  AdminSellerSummaryView,
} from '../../seller/application/views/admin-seller.view'
import type { SellerEntity } from '../../seller/domain/entities/seller.entity'
import { SellerNotFoundException } from '../../seller/domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../seller/domain/ports/seller.repository.port'
import { SellerDomainExceptionFilter } from '../../seller/presentation/filters/seller-exception.filter'
import {
  toSellerResponse,
  type SellerResponseView,
} from '../../seller/presentation/mappers/seller-response.mapper'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

interface ListEnvelope<T> {
  success: true
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

@ApiTags('admin')
@Controller('admin/sellers')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('access_token')
@UseFilters(SellerDomainExceptionFilter)
export class AdminSellerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List sellers for the admin moderation queue.' })
  @ApiResponse({ status: 200, description: 'Paginated seller summaries.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  async list(
    @Query() filters: ListAdminSellersDto,
  ): Promise<ListEnvelope<AdminSellerSummaryView>> {
    const page = await this.queryBus.execute<ListAdminSellersQuery, AdminSellerListPage>(
      new ListAdminSellersQuery(filters),
    )
    return {
      success: true,
      data: page.data,
      meta: {
        total: page.total,
        page: page.page,
        limit: page.limit,
        totalPages: page.totalPages,
      },
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get full seller detail (KYC docs + bank fields) for review.' })
  @ApiResponse({ status: 200, description: 'Seller detail view.' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'SELLER_NOT_FOUND' })
  async getById(@Param('id') id: string): Promise<SuccessEnvelope<AdminSellerDetailView>> {
    // Make sure the seller exists (and would be visible to non-admin tooling)
    // before reading the fully privileged detail view; SellerNotFound surfaces
    // a 404 via the domain exception filter.
    await this.queryBus.execute<GetSellerQuery, SellerEntity>(new GetSellerQuery(id))
    const detail = await this.sellers.findDetailForAdmin(id)
    if (!detail) throw new SellerNotFoundException(id)
    return { success: true, data: detail }
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a pending seller (admin only).' })
  @ApiResponse({ status: 200, description: 'Seller approved.' })
  @ApiResponse({ status: 400, description: 'SELLER_KYC_NOT_PENDING' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'SELLER_NOT_FOUND' })
  async approve(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SuccessEnvelope<SellerResponseView>> {
    const seller = await this.commandBus.execute<ApproveSellerCommand, SellerEntity>(
      new ApproveSellerCommand(id, user.userId),
    )
    return { success: true, data: toSellerResponse(seller) }
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a pending seller (admin only).' })
  @ApiResponse({ status: 200, description: 'Seller rejected.' })
  @ApiResponse({ status: 400, description: 'SELLER_KYC_NOT_PENDING' })
  @ApiResponse({ status: 403, description: 'Caller is not an admin.' })
  @ApiResponse({ status: 404, description: 'SELLER_NOT_FOUND' })
  async reject(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RejectSellerDto,
  ): Promise<SuccessEnvelope<SellerResponseView>> {
    const seller = await this.commandBus.execute<RejectSellerCommand, SellerEntity>(
      new RejectSellerCommand(id, user.userId, dto.reason),
    )
    return { success: true, data: toSellerResponse(seller) }
  }
}
