import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { type AuthenticatedUser, CurrentUser, JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

import { ApproveSellerCommand } from '../../seller/application/commands/approve-seller/approve-seller.command'
import { RejectSellerCommand } from '../../seller/application/commands/reject-seller/reject-seller.command'
import { RejectSellerDto } from '../../seller/application/dtos/reject-seller.dto'
import type { SellerEntity } from '../../seller/domain/entities/seller.entity'
import { SellerDomainExceptionFilter } from '../../seller/presentation/filters/seller-exception.filter'
import {
  toSellerResponse,
  type SellerResponseView,
} from '../../seller/presentation/mappers/seller-response.mapper'

interface SuccessEnvelope<T> {
  success: true
  data: T
}

@ApiTags('admin')
@Controller('admin/sellers')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('access_token')
@UseFilters(SellerDomainExceptionFilter)
export class AdminSellerController {
  constructor(private readonly commandBus: CommandBus) {}

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
