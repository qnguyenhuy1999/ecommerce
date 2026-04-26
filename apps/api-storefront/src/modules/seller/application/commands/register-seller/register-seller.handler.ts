import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Prisma } from '@prisma/client'

import { RegisterSellerCommand } from './register-seller.command'
import type { SellerEntity } from '../../../domain/entities/seller.entity'
import {
  SellerAlreadyRegisteredException,
  StoreNameExistsException,
} from '../../../domain/exceptions/seller.exceptions'
import {
  ISellerRepository,
  SELLER_REPOSITORY,
} from '../../../domain/ports/seller.repository.port'

@CommandHandler(RegisterSellerCommand)
export class RegisterSellerHandler implements ICommandHandler<RegisterSellerCommand, SellerEntity> {
  private readonly logger = new Logger(RegisterSellerHandler.name)

  constructor(@Inject(SELLER_REPOSITORY) private readonly sellers: ISellerRepository) {}

  async execute(command: RegisterSellerCommand): Promise<SellerEntity> {
    const existing = await this.sellers.findByUserId(command.userId)
    if (existing) throw new SellerAlreadyRegisteredException()

    const { dto } = command
    try {
      const seller = await this.sellers.create({
        userId: command.userId,
        storeName: dto.storeName,
        storeDescription: dto.storeDescription ?? null,
        businessRegistrationNumber: dto.businessRegistrationNumber,
        bankAccountNumber: dto.bankAccountNumber,
        bankCode: dto.bankCode,
        kycDocuments: dto.kycDocuments ?? null,
      })
      this.logger.log(`User ${command.userId} registered seller ${seller.id}`)
      return seller
    } catch (error) {
      throw this.mapPrismaError(error, dto.storeName)
    }
  }

  private mapPrismaError(error: unknown, storeName: string): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = (error.meta?.target as string[] | string | undefined) ?? []
      const fields = Array.isArray(target) ? target : [target]
      if (fields.some((field) => typeof field === 'string' && field.includes('user'))) {
        return new SellerAlreadyRegisteredException()
      }
      return new StoreNameExistsException(storeName)
    }
    return error instanceof Error ? error : new Error(String(error))
  }
}
