import test from 'node:test'
import assert from 'node:assert/strict'
import { unwrapApiData } from './seller-page-api'

void test('unwrapApiData returns direct payloads unchanged', () => {
  const payload = {
    totalRevenue: 3200,
    orderCount: 18,
    averageOrderValue: 177.77,
    dailyRevenue: [{ date: '2026-05-20T00:00:00.000Z', revenue: 1200 }],
  }

  assert.equal(unwrapApiData(payload), payload)
})

void test('unwrapApiData unwraps nested items payloads', () => {
  const payload = {
    items: [{ id: 'n1' }, { id: 'n2' }],
  }

  assert.deepEqual(unwrapApiData(payload), payload.items)
})
