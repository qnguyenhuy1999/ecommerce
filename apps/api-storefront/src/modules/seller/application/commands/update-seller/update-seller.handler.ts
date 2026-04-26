import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'

import { UpdateSellerCommand } from './update-seller.command'
import type { SellerEntity } from '../../../domain/entities/seller.entity'
import {
  NotSellerOwnerException,
  SellerNotFoundException,
  StoreNameExistsException,
} from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'

@CommandHandler(UpdateSellerCommand)
export class UpdateSellerHandler implements ICommandHandler<UpdateSellerCommand, SellerEntity> {
  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(command: UpdateSellerCommand): Promise<SellerEntity> {
    const seller = await this.sellers.findById(command.sellerId)
    if (!seller) throw new SellerNotFoundException(command.sellerId)

    const isAdmin = command.userRole === 'ADMIN'
    if (!isAdmin && !seller.isOwnedBy(command.userId)) {
      throw new NotSellerOwnerException()
    }

    try {
      return await this.sellers.update(command.sellerId, {
        storeName: command.dto.storeName,
        storeDescription: command.dto.storeDescription ?? undefined,
        businessRegistrationNumber: command.dto.businessRegistrationNumber ?? undefined,
        bankAccountNumber: command.dto.bankAccountNumber ?? undefined,
        bankCode: command.dto.bankCode ?? undefined,
        kycDocuments: command.dto.kycDocuments ?? undefined,
      })
    } catch (error) {
      throw this.mapPrismaError(error, command.dto.storeName)
    }
  }

  private mapPrismaError(error: unknown, storeName: string | undefined): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return new StoreNameExistsException(storeName ?? '')
    }
    return error instanceof Error ? error : new Error(String(error))
  }
}
