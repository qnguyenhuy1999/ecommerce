import 'reflect-metadata'

import { ListUserOrdersDto } from '../../src/modules/order/application/dtos/list-user-orders.dto'
import { ListUserOrdersHandler } from '../../src/modules/order/application/queries/list-user-orders/list-user-orders.handler'
import { ListUserOrdersQuery } from '../../src/modules/order/application/queries/list-user-orders/list-user-orders.query'
import type {
  OrderHistoryPage,
  OrderHistoryView,
} from '../../src/modules/order/application/views/order-history.view'
import type { IOrderRepository } from '../../src/modules/order/domain/ports/order.repository.port'

function buildHistory(overrides: Partial<OrderHistoryView> = {}): OrderHistoryView {
  return {
    orderId: 'order-1',
    orderNumber: 'ORD-20260425-AAA111',
    status: 'PAID',
    subtotal: 150,
    shippingFee: 10,
    totalAmount: 160,
    subOrders: [
      {
        id: 'sub-1',
        sellerId: 'seller-1',
        storeName: 'Acme Store',
        subtotal: 150,
        status: 'PAID',
        items: [
          {
            id: 'item-1',
            variantId: 'variant-1',
            productName: 'Cotton T-Shirt',
            variantSku: 'TSHIRT-BLACK-M',
            attributes: { color: 'Black', size: 'M' },
            quantity: 3,
            unitPrice: 50,
            priceSnapshot: { productName: 'Cotton T-Shirt', variantSku: 'TSHIRT-BLACK-M' },
          },
        ],
      },
    ],
    createdAt: '2026-04-25T12:00:00.000Z',
    ...overrides,
  }
}

function buildFilters(overrides: Partial<ListUserOrdersDto> = {}): ListUserOrdersDto {
  const dto = new ListUserOrdersDto()
  dto.page = 1
  dto.limit = 20
  dto.sort = 'createdAt'
  dto.order = 'desc'
  Object.assign(dto, overrides)
  return dto
}

function buildRepo(page: OrderHistoryPage): IOrderRepository {
  return {
    createFromCart: jest.fn(),
    listByBuyer: jest.fn().mockResolvedValue(page),
  }
}

describe('ListUserOrdersHandler', () => {
  it('forwards the buyerId from the authenticated query into the repository call', async () => {
    const page: OrderHistoryPage = {
      data: [buildHistory()],
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    }
    const repo = buildRepo(page)
    const handler = new ListUserOrdersHandler(repo)

    const result = await handler.execute(new ListUserOrdersQuery('buyer-1', buildFilters()))

    expect(repo.listByBuyer).toHaveBeenCalledTimes(1)
    expect(repo.listByBuyer).toHaveBeenCalledWith({
      buyerId: 'buyer-1',
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
      status: undefined,
    })
    expect(result).toEqual(page)
  })

  it('passes the optional status filter through', async () => {
    const page: OrderHistoryPage = { data: [], page: 2, limit: 5, total: 0, totalPages: 1 }
    const repo = buildRepo(page)
    const handler = new ListUserOrdersHandler(repo)

    await handler.execute(
      new ListUserOrdersQuery(
        'buyer-1',
        buildFilters({ page: 2, limit: 5, status: 'SHIPPED' }),
      ),
    )

    expect(repo.listByBuyer).toHaveBeenCalledWith(
      expect.objectContaining({ buyerId: 'buyer-1', page: 2, limit: 5, status: 'SHIPPED' }),
    )
  })

  it('returns the repository pagination metadata unchanged', async () => {
    const page: OrderHistoryPage = {
      data: Array.from({ length: 3 }, (_, i) =>
        buildHistory({ orderId: `order-${i + 1}`, orderNumber: `ORD-TEST-${i + 1}` }),
      ),
      page: 2,
      limit: 3,
      total: 7,
      totalPages: 3,
    }
    const repo = buildRepo(page)
    const handler = new ListUserOrdersHandler(repo)

    const result = await handler.execute(
      new ListUserOrdersQuery('buyer-1', buildFilters({ page: 2, limit: 3 })),
    )

    expect(result.page).toBe(2)
    expect(result.limit).toBe(3)
    expect(result.total).toBe(7)
    expect(result.totalPages).toBe(3)
    expect(result.data).toHaveLength(3)
  })
})
