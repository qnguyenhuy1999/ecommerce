import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RejectSellerCommand } from './reject-seller.command'
import type { SellerEntity } from '../../../domain/entities/seller.entity'
import {
  SellerKycNotPendingException,
  SellerNotFoundException,
} from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'

@CommandHandler(RejectSellerCommand)
export class RejectSellerHandler implements ICommandHandler<RejectSellerCommand, SellerEntity> {
  private readonly logger = new Logger(RejectSellerHandler.name)

  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(command: RejectSellerCommand): Promise<SellerEntity> {
    const seller = await this.sellers.findById(command.sellerId)
    if (!seller) throw new SellerNotFoundException(command.sellerId)
    if (!seller.isPending()) throw new SellerKycNotPendingException(seller.kycStatus)

    const updated = await this.sellers.transitionKycStatus({
      sellerId: command.sellerId,
      fromStatus: 'PENDING',
      toStatus: 'REJECTED',
      adminUserId: command.adminUserId,
      reason: command.reason ?? null,
    })
    this.logger.log(`Admin ${command.adminUserId} rejected seller ${command.sellerId}`)
    return updated
  }
}
