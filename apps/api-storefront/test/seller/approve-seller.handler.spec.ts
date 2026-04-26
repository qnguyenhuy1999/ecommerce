import { ApproveSellerCommand } from '../../src/modules/seller/application/commands/approve-seller/approve-seller.command'
import { ApproveSellerHandler } from '../../src/modules/seller/application/commands/approve-seller/approve-seller.handler'
import { RejectSellerCommand } from '../../src/modules/seller/application/commands/reject-seller/reject-seller.command'
import { RejectSellerHandler } from '../../src/modules/seller/application/commands/reject-seller/reject-seller.handler'
import { type KycStatus, SellerEntity } from '../../src/modules/seller/domain/entities/seller.entity'
import {
  SellerKycNotPendingException,
  SellerNotFoundException,
} from '../../src/modules/seller/domain/exceptions/seller.exceptions'
import type { ISellerRepository } from '../../src/modules/seller/domain/ports/seller.repository.port'

function buildSeller(kycStatus: KycStatus = 'PENDING'): SellerEntity {
  return new SellerEntity({
    id: 'seller-1',
    userId: 'user-1',
    storeName: 'Test Store',
    storeDescription: null,
    kycStatus,
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
    findById: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    transitionKycStatus: jest.fn(),
    ...overrides,
  }
}

describe('ApproveSellerHandler', () => {
  it('transitions a pending seller to APPROVED with the admin recorded', async () => {
    const approved = buildSeller('APPROVED')
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('PENDING')),
      transitionKycStatus: jest.fn().mockResolvedValue(approved),
    })
    const handler = new ApproveSellerHandler(repo)

    const result = await handler.execute(new ApproveSellerCommand('seller-1', 'admin-1'))

    expect(result.kycStatus).toBe('APPROVED')
    expect(repo.transitionKycStatus).toHaveBeenCalledWith({
      sellerId: 'seller-1',
      fromStatus: 'PENDING',
      toStatus: 'APPROVED',
      adminUserId: 'admin-1',
    })
  })

  it('throws SELLER_NOT_FOUND when the seller does not exist', async () => {
    const repo = buildRepo({ findById: jest.fn().mockResolvedValue(null) })
    const handler = new ApproveSellerHandler(repo)

    await expect(
      handler.execute(new ApproveSellerCommand('missing', 'admin-1')),
    ).rejects.toBeInstanceOf(SellerNotFoundException)
    expect(repo.transitionKycStatus).not.toHaveBeenCalled()
  })

  it('refuses to re-approve an already-approved seller', async () => {
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('APPROVED')),
    })
    const handler = new ApproveSellerHandler(repo)

    await expect(
      handler.execute(new ApproveSellerCommand('seller-1', 'admin-1')),
    ).rejects.toBeInstanceOf(SellerKycNotPendingException)
    expect(repo.transitionKycStatus).not.toHaveBeenCalled()
  })
})

describe('RejectSellerHandler', () => {
  it('transitions a pending seller to REJECTED and records the reason', async () => {
    const rejected = buildSeller('REJECTED')
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('PENDING')),
      transitionKycStatus: jest.fn().mockResolvedValue(rejected),
    })
    const handler = new RejectSellerHandler(repo)

    const result = await handler.execute(
      new RejectSellerCommand('seller-1', 'admin-1', 'Documents incomplete'),
    )

    expect(result.kycStatus).toBe('REJECTED')
    expect(repo.transitionKycStatus).toHaveBeenCalledWith({
      sellerId: 'seller-1',
      fromStatus: 'PENDING',
      toStatus: 'REJECTED',
      adminUserId: 'admin-1',
      reason: 'Documents incomplete',
    })
  })

  it('refuses to reject a non-pending seller', async () => {
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('REJECTED')),
    })
    const handler = new RejectSellerHandler(repo)

    await expect(
      handler.execute(new RejectSellerCommand('seller-1', 'admin-1')),
    ).rejects.toBeInstanceOf(SellerKycNotPendingException)
  })
})
