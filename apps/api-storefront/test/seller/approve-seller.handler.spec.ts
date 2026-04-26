import { ApproveSellerCommand } from '../../src/modules/seller/application/commands/approve-seller/approve-seller.command'
import { ApproveSellerHandler } from '../../src/modules/seller/application/commands/approve-seller/approve-seller.handler'
import { RejectSellerCommand } from '../../src/modules/seller/application/commands/reject-seller/reject-seller.command'
import { RejectSellerHandler } from '../../src/modules/seller/application/commands/reject-seller/reject-seller.handler'
import { type KycStatus, SellerEntity } from '../../src/modules/seller/domain/entities/seller.entity'
import {
  SellerKycNotPendingException,
  SellerNotFoundException,
} from '../../src/modules/seller/domain/exceptions/seller.exceptions'
import type {
  ISellerRepository,
  SellerKycTransitionCallback,
  SellerKycTransitionInput,
} from '../../src/modules/seller/domain/ports/seller.repository.port'
import type { NotificationService } from '../../src/modules/notification/notification.service'

function buildNotifications(): NotificationService {
  return {
    recordNotificationFromEvent: jest.fn().mockResolvedValue({
      id: 'notif-1',
      type: 'SELLER_APPROVED',
      title: '',
      body: '',
      data: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    }),
    dispatchEmailForEvent: jest.fn().mockResolvedValue(undefined),
    createFromEvent: jest.fn(),
  } as unknown as NotificationService
}

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

/**
 * Mock implementation that mirrors the real repository's contract: invokes
 * the optional callback with a fake `tx` and the refreshed seller, then
 * returns that seller. This lets us assert that the handler hands the same
 * tx to the notification service.
 */
function transitionMock(returned: SellerEntity, fakeTx: unknown = { __mock: 'tx' }) {
  return jest
    .fn(async (_input: SellerKycTransitionInput, withinTx?: SellerKycTransitionCallback) => {
      if (withinTx) {
        await withinTx(fakeTx as never, returned)
      }
      return returned
    })
}

describe('ApproveSellerHandler', () => {
  it('records the SELLER_APPROVED notification inside the same tx and dispatches email after commit', async () => {
    const approved = buildSeller('APPROVED')
    const fakeTx = { __mock: 'tx' }
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('PENDING')),
      transitionKycStatus: transitionMock(approved, fakeTx),
    })
    const notifications = buildNotifications()
    const handler = new ApproveSellerHandler(repo, notifications)

    const result = await handler.execute(new ApproveSellerCommand('seller-1', 'admin-1'))

    expect(result.kycStatus).toBe('APPROVED')
    expect(repo.transitionKycStatus).toHaveBeenCalledWith(
      {
        sellerId: 'seller-1',
        fromStatus: 'PENDING',
        toStatus: 'APPROVED',
        adminUserId: 'admin-1',
      },
      expect.any(Function),
    )
    expect(notifications.recordNotificationFromEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SELLER_APPROVED',
        userId: 'user-1',
        sellerId: 'seller-1',
        storeName: 'Test Store',
        tx: fakeTx,
      }),
    )
    expect(notifications.dispatchEmailForEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SELLER_APPROVED',
        userId: 'user-1',
        sellerId: 'seller-1',
        storeName: 'Test Store',
      }),
    )
    // Ownership over the order of effects: the in-tx record must complete
    // before the post-commit dispatch fires.
    const recordOrder = (notifications.recordNotificationFromEvent as jest.Mock).mock
      .invocationCallOrder[0]
    const dispatchOrder = (notifications.dispatchEmailForEvent as jest.Mock).mock
      .invocationCallOrder[0]
    expect(recordOrder).toBeLessThan(dispatchOrder)
  })

  it('throws SELLER_NOT_FOUND when the seller does not exist', async () => {
    const repo = buildRepo({ findById: jest.fn().mockResolvedValue(null) })
    const notifications = buildNotifications()
    const handler = new ApproveSellerHandler(repo, notifications)

    await expect(
      handler.execute(new ApproveSellerCommand('missing', 'admin-1')),
    ).rejects.toBeInstanceOf(SellerNotFoundException)
    expect(repo.transitionKycStatus).not.toHaveBeenCalled()
    expect(notifications.recordNotificationFromEvent).not.toHaveBeenCalled()
    expect(notifications.dispatchEmailForEvent).not.toHaveBeenCalled()
  })

  it('refuses to re-approve an already-approved seller', async () => {
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('APPROVED')),
    })
    const notifications = buildNotifications()
    const handler = new ApproveSellerHandler(repo, notifications)

    await expect(
      handler.execute(new ApproveSellerCommand('seller-1', 'admin-1')),
    ).rejects.toBeInstanceOf(SellerKycNotPendingException)
    expect(repo.transitionKycStatus).not.toHaveBeenCalled()
    expect(notifications.recordNotificationFromEvent).not.toHaveBeenCalled()
    expect(notifications.dispatchEmailForEvent).not.toHaveBeenCalled()
  })

  it('rolls back the transition when notification recording throws', async () => {
    // Real Prisma's $transaction rolls back when the callback throws — here
    // we model that contract by having the mock surface the callback error
    // instead of returning the seller, ensuring the handler doesn't swallow
    // it (which would otherwise leave the seller flipped without a notif).
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('PENDING')),
      transitionKycStatus: jest.fn(
        async (_input: SellerKycTransitionInput, withinTx?: SellerKycTransitionCallback) => {
          if (withinTx) {
            await withinTx({ __mock: 'tx' } as never, buildSeller('APPROVED'))
          }
          throw new Error('callback should have thrown')
        },
      ),
    })
    const notifications = buildNotifications()
    ;(notifications.recordNotificationFromEvent as jest.Mock).mockRejectedValue(
      new Error('db down'),
    )
    const handler = new ApproveSellerHandler(repo, notifications)

    await expect(
      handler.execute(new ApproveSellerCommand('seller-1', 'admin-1')),
    ).rejects.toThrow('db down')
    expect(notifications.dispatchEmailForEvent).not.toHaveBeenCalled()
  })
})

describe('RejectSellerHandler', () => {
  it('records the SELLER_REJECTED notification inside the same tx and skips email dispatch', async () => {
    const rejected = buildSeller('REJECTED')
    const fakeTx = { __mock: 'tx' }
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('PENDING')),
      transitionKycStatus: transitionMock(rejected, fakeTx),
    })
    const notifications = buildNotifications()
    const handler = new RejectSellerHandler(repo, notifications)

    const result = await handler.execute(
      new RejectSellerCommand('seller-1', 'admin-1', 'Documents incomplete'),
    )

    expect(result.kycStatus).toBe('REJECTED')
    expect(repo.transitionKycStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        sellerId: 'seller-1',
        fromStatus: 'PENDING',
        toStatus: 'REJECTED',
        adminUserId: 'admin-1',
        reason: 'Documents incomplete',
      }),
      expect.any(Function),
    )
    expect(notifications.recordNotificationFromEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'SELLER_REJECTED',
        userId: 'user-1',
        sellerId: 'seller-1',
        storeName: 'Test Store',
        reason: 'Documents incomplete',
        tx: fakeTx,
      }),
    )
    // SELLER_REJECTED has no email job — no post-commit dispatch.
    expect(notifications.dispatchEmailForEvent).not.toHaveBeenCalled()
  })

  it('refuses to reject a non-pending seller', async () => {
    const repo = buildRepo({
      findById: jest.fn().mockResolvedValue(buildSeller('REJECTED')),
    })
    const notifications = buildNotifications()
    const handler = new RejectSellerHandler(repo, notifications)

    await expect(
      handler.execute(new RejectSellerCommand('seller-1', 'admin-1')),
    ).rejects.toBeInstanceOf(SellerKycNotPendingException)
    expect(notifications.recordNotificationFromEvent).not.toHaveBeenCalled()
    expect(notifications.dispatchEmailForEvent).not.toHaveBeenCalled()
  })
})
