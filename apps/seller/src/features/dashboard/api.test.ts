import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeDashboardBundle } from './normalize'

void test('normalizeDashboardBundle fills empty section defaults when partial data is missing', () => {
  const bundle = normalizeDashboardBundle({
    overview: {
      revenue: { current: 400, previous: 200, growth: 100 },
      pendingOrders: 3,
      activeProducts: 9,
      lowStockCount: 1,
    },
    analytics: {
      revenue: null,
      orders: null,
      products: [],
    },
    inventory: {
      lowStock: [],
    },
    notifications: {
      unreadCount: null,
      items: [],
    },
    orders: {
      pending: [],
    },
    returns: {
      stats: null,
    },
    partialErrors: {
      analytics: 'analytics unavailable',
    },
  })

  assert.equal(bundle.revenue.totalRevenue, 0)
  assert.equal(bundle.orders.total, 0)
  assert.equal(bundle.unreadCount.count, 0)
  assert.equal(bundle.returnStats.open, 0)
  assert.equal(bundle.partialErrors?.analytics, 'analytics unavailable')
})
