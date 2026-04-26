import { Prisma } from '@prisma/client'

import { RegisterSellerCommand } from '../../src/modules/seller/application/commands/register-seller/register-seller.command'
import { RegisterSellerHandler } from '../../src/modules/seller/application/commands/register-seller/register-seller.handler'
import { SellerEntity } from '../../src/modules/seller/domain/entities/seller.entity'
import {
  SellerAlreadyRegisteredException,
  StoreNameExistsException,
} from '../../src/modules/seller/domain/exceptions/seller.exceptions'
import type { ISellerRepository } from '../../src/modules/seller/domain/ports/seller.repository.port'

function buildSeller(overrides: Partial<{ id: string; userId: string; storeName: string }> = {}): SellerEntity {
  return new SellerEntity({
    id: overrides.id ?? 'seller-1',
    userId: overrides.userId ?? 'user-1',
    storeName: overrides.storeName ?? 'Existing Store',
    storeDescription: null,
    kycStatus: 'PENDING',
    kycDocuments: null,
    commissionRate: 0.1,
    rating: 0,
    totalRatings: 0,
    businessRegistrationNumber: null,
    bankAccountNumber: null,
    bankCode: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

function buildRepo(overrides: Partial<ISellerRepository> = {}): ISellerRepository {
  return {
    findById: jest.fn().mockResolvedValue(null),
    findByUserId: jest.fn().mockResolvedValue(null),
    create: jest.fn(),
    update: jest.fn(),
    transitionKycStatus: jest.fn(),
    ...overrides,
  }
}

describe('RegisterSellerHandler', () => {
  it('creates a PENDING seller for a first-time registrant', async () => {
    const created = buildSeller({ storeName: 'New Store' })
    const repo = buildRepo({
      findByUserId: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(created),
    })
    const handler = new RegisterSellerHandler(repo)

    const result = await handler.execute(
      new RegisterSellerCommand('user-1', {
        storeName: 'New Store',
        businessRegistrationNumber: '202012345A',
        bankAccountNumber: '1234567890',
        bankCode: 'SCB',
      }),
    )

    expect(result).toBe(created)
    expect(result.kycStatus).toBe('PENDING')
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', storeName: 'New Store' }),
    )
  })

  it('rejects a second registration attempt by the same user', async () => {
    const repo = buildRepo({
      findByUserId: jest.fn().mockResolvedValue(buildSeller()),
    })
    const handler = new RegisterSellerHandler(repo)

    await expect(
      handler.execute(
        new RegisterSellerCommand('user-1', {
          storeName: 'Another Store',
          businessRegistrationNumber: '999',
          bankAccountNumber: '999',
          bankCode: 'SCB',
        }),
      ),
    ).rejects.toBeInstanceOf(SellerAlreadyRegisteredException)
    expect(repo.create).not.toHaveBeenCalled()
  })

  it('translates a Prisma store_name unique violation into STORE_NAME_EXISTS', async () => {
    const repo = buildRepo({
      findByUserId: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique', {
          code: 'P2002',
          clientVersion: 'test',
          meta: { target: ['store_name'] },
        }),
      ),
    })
    const handler = new RegisterSellerHandler(repo)

    await expect(
      handler.execute(
        new RegisterSellerCommand('user-1', {
          storeName: 'Taken Store',
          businessRegistrationNumber: '1',
          bankAccountNumber: '1',
          bankCode: 'SCB',
        }),
      ),
    ).rejects.toBeInstanceOf(StoreNameExistsException)
  })

  it('translates a Prisma user_id unique violation into SELLER_ALREADY_REGISTERED', async () => {
    const repo = buildRepo({
      findByUserId: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique', {
          code: 'P2002',
          clientVersion: 'test',
          meta: { target: ['user_id'] },
        }),
      ),
    })
    const handler = new RegisterSellerHandler(repo)

    await expect(
      handler.execute(
        new RegisterSellerCommand('user-1', {
          storeName: 'Whatever',
          businessRegistrationNumber: '1',
          bankAccountNumber: '1',
          bankCode: 'SCB',
        }),
      ),
    ).rejects.toBeInstanceOf(SellerAlreadyRegisteredException)
  })
})
