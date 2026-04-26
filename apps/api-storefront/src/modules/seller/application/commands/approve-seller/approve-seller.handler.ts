import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { ApproveSellerCommand } from './approve-seller.command'
import { NotificationService } from '../../../../notification/notification.service'
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

  constructor(
    @Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository,
    private readonly notifications: NotificationService,
  ) {}

  async execute(command: ApproveSellerCommand): Promise<SellerEntity> {
    const seller = await this.sellers.findById(command.sellerId)
    if (!seller) throw new SellerNotFoundException(command.sellerId)
    if (!seller.isPending()) throw new SellerKycNotPendingException(seller.kycStatus)

    // The notification row is recorded inside the same transaction as the
    // KYC transition so the seller status and the notification commit (or
    // roll back) together. The email job is dispatched after commit on a
    // best-effort basis.
    const updated = await this.sellers.transitionKycStatus(
      {
        sellerId: command.sellerId,
        fromStatus: 'PENDING',
        toStatus: 'APPROVED',
        adminUserId: command.adminUserId,
      },
      async (tx, refreshed) => {
        await this.notifications.recordNotificationFromEvent({
          type: 'SELLER_APPROVED',
          userId: refreshed.userId,
          sellerId: refreshed.id,
          storeName: refreshed.props.storeName,
          tx,
        })
      },
    )

    await this.notifications.dispatchEmailForEvent({
      type: 'SELLER_APPROVED',
      userId: updated.userId,
      sellerId: updated.id,
      storeName: updated.props.storeName,
    })

    this.logger.log(`Admin ${command.adminUserId} approved seller ${command.sellerId}`)
    return updated
  }
}
