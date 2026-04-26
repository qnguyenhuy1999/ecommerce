import { CreateProductCommand } from '../../src/modules/product/application/commands/create-product/create-product.command'
import { CreateProductHandler } from '../../src/modules/product/application/commands/create-product/create-product.handler'
import { UpdateProductCommand } from '../../src/modules/product/application/commands/update-product/update-product.command'
import { UpdateProductHandler } from '../../src/modules/product/application/commands/update-product/update-product.handler'
import { CreateProductStatus } from '../../src/modules/product/application/dtos/create-product.dto'
import { UpdateProductStatus } from '../../src/modules/product/application/dtos/update-product.dto'
import { ProductEntity } from '../../src/modules/product/domain/entities/product.entity'
import { type KycStatus, SellerSummary } from '../../src/modules/product/domain/entities/seller.entity'
import {
  KycNotApprovedException,
  NotProductOwnerException,
  ProductNotFoundException,
  SellerNotFoundException,
} from '../../src/modules/product/domain/exceptions/product.exceptions'
import type { IProductRepository } from '../../src/modules/product/domain/ports/product.repository.port'
import type { ISellerLookup } from '../../src/modules/product/domain/ports/seller-lookup.port'

function buildSellerSummary(kycStatus: KycStatus, userId = 'user-1'): SellerSummary {
  return new SellerSummary({ id: 'seller-1', userId, storeName: 'Store', kycStatus })
}

function buildProduct(overrides: Partial<{ ownerUserId: string; status: 'DRAFT' | 'ACTIVE' }> = {}): ProductEntity {
  return new ProductEntity({
    id: 'product-1',
    sellerId: 'seller-1',
    sku: 'SKU-1',
    name: 'Test',
    description: null,
    price: 10,
    status: overrides.status ?? 'DRAFT',
    categoryId: null,
    images: [],
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    seller: { id: 'seller-1', userId: overrides.ownerUserId ?? 'user-1', storeName: 'Store', rating: 0 },
  })
}

function buildSellerLookup(seller: SellerSummary | null): ISellerLookup {
  return { findByUserId: jest.fn().mockResolvedValue(seller) }
}

function buildProductRepo(overrides: Partial<IProductRepository> = {}): IProductRepository {
  return {
    list: jest.fn(),
    findByIdWithDetails: jest.fn(),
    findForOwnerCheck: jest.fn(),
    findBySellerAndSku: jest.fn(),
    listVariants: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    ...overrides,
  }
}

describe('Product creation KYC gate', () => {
  const baseCreateDto = {
    sku: 'SKU-1',
    name: 'Test',
    price: 10,
    status: CreateProductStatus.ACTIVE,
  }

  it('rejects creation when the user has no seller profile', async () => {
    const handler = new CreateProductHandler(buildProductRepo(), buildSellerLookup(null))
    await expect(
      handler.execute(new CreateProductCommand('user-1', baseCreateDto)),
    ).rejects.toBeInstanceOf(SellerNotFoundException)
  })

  it('rejects creation when seller KYC is PENDING', async () => {
    const handler = new CreateProductHandler(
      buildProductRepo(),
      buildSellerLookup(buildSellerSummary('PENDING')),
    )
    await expect(
      handler.execute(new CreateProductCommand('user-1', baseCreateDto)),
    ).rejects.toBeInstanceOf(KycNotApprovedException)
  })

  it('rejects creation when seller KYC is REJECTED', async () => {
    const handler = new CreateProductHandler(
      buildProductRepo(),
      buildSellerLookup(buildSellerSummary('REJECTED')),
    )
    await expect(
      handler.execute(new CreateProductCommand('user-1', baseCreateDto)),
    ).rejects.toBeInstanceOf(KycNotApprovedException)
  })

  it('allows creation when seller KYC is APPROVED', async () => {
    const created = buildProduct({ status: 'ACTIVE' })
    const repo = buildProductRepo({
      findBySellerAndSku: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(created),
    })
    const handler = new CreateProductHandler(repo, buildSellerLookup(buildSellerSummary('APPROVED')))

    const result = await handler.execute(new CreateProductCommand('user-1', baseCreateDto))
    expect(result).toBe(created)
    expect(repo.create).toHaveBeenCalled()
  })
})

describe('Product publish (update -> ACTIVE) KYC gate', () => {
  it('rejects publishing when seller KYC is PENDING', async () => {
    const repo = buildProductRepo({
      findForOwnerCheck: jest.fn().mockResolvedValue(buildProduct()),
    })
    const handler = new UpdateProductHandler(repo, buildSellerLookup(buildSellerSummary('PENDING')))

    await expect(
      handler.execute(
        new UpdateProductCommand('product-1', 'user-1', { status: UpdateProductStatus.ACTIVE }),
      ),
    ).rejects.toBeInstanceOf(KycNotApprovedException)
    expect(repo.update).not.toHaveBeenCalled()
  })

  it('allows non-publish updates for pending sellers (e.g., editing description)', async () => {
    const repo = buildProductRepo({
      findForOwnerCheck: jest.fn().mockResolvedValue(buildProduct()),
      update: jest.fn().mockResolvedValue(buildProduct()),
    })
    const handler = new UpdateProductHandler(repo, buildSellerLookup(buildSellerSummary('PENDING')))

    await handler.execute(
      new UpdateProductCommand('product-1', 'user-1', { description: 'Updated copy' }),
    )
    expect(repo.update).toHaveBeenCalled()
  })

  it('allows publishing when seller KYC is APPROVED', async () => {
    const repo = buildProductRepo({
      findForOwnerCheck: jest.fn().mockResolvedValue(buildProduct()),
      update: jest.fn().mockResolvedValue(buildProduct({ status: 'ACTIVE' })),
    })
    const handler = new UpdateProductHandler(repo, buildSellerLookup(buildSellerSummary('APPROVED')))

    const result = await handler.execute(
      new UpdateProductCommand('product-1', 'user-1', { status: UpdateProductStatus.ACTIVE }),
    )
    expect(result.status).toBe('ACTIVE')
  })

  it('rejects updates from non-owners before checking KYC', async () => {
    const repo = buildProductRepo({
      findForOwnerCheck: jest.fn().mockResolvedValue(buildProduct({ ownerUserId: 'other-user' })),
    })
    const lookup = buildSellerLookup(buildSellerSummary('APPROVED'))
    const handler = new UpdateProductHandler(repo, lookup)

    await expect(
      handler.execute(
        new UpdateProductCommand('product-1', 'user-1', { status: UpdateProductStatus.ACTIVE }),
      ),
    ).rejects.toBeInstanceOf(NotProductOwnerException)
    expect(lookup.findByUserId).not.toHaveBeenCalled()
  })

  it('rejects updates when the product does not exist', async () => {
    const repo = buildProductRepo({
      findForOwnerCheck: jest.fn().mockResolvedValue(null),
    })
    const handler = new UpdateProductHandler(repo, buildSellerLookup(buildSellerSummary('APPROVED')))

    await expect(
      handler.execute(
        new UpdateProductCommand('missing', 'user-1', { status: UpdateProductStatus.ACTIVE }),
      ),
    ).rejects.toBeInstanceOf(ProductNotFoundException)
  })
})
