import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { ApproveSellerCommand } from './approve-seller.command'
import type { SellerEntity } from '../../../domain/entities/seller.entity'
import {
  SellerKycNotPendingException,
  SellerNotFoundException,
} from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'

@CommandHandler(ApproveSellerCommand)
export class ApproveSellerHandler implements ICommandHandler<ApproveSellerCommand, SellerEntity> {
  private readonly logger = new Logger(ApproveSellerHandler.name)

  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(command: ApproveSellerCommand): Promise<SellerEntity> {
    const seller = await this.sellers.findById(command.sellerId)
    if (!seller) throw new SellerNotFoundException(command.sellerId)
    if (!seller.isPending()) throw new SellerKycNotPendingException(seller.kycStatus)

    const updated = await this.sellers.transitionKycStatus({
      sellerId: command.sellerId,
      fromStatus: 'PENDING',
      toStatus: 'APPROVED',
      adminUserId: command.adminUserId,
    })
    this.logger.log(`Admin ${command.adminUserId} approved seller ${command.sellerId}`)
    return updated
  }
}
