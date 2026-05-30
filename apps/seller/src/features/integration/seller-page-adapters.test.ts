import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { ProductDetailFormData } from '@ecom/ui-seller/pages/ProductDetail'
import type { VoucherDetailFormData } from '@ecom/ui-seller/pages/VoucherDetail'
import {
  buildAnalyticsProps,
  buildDashboardProps,
  buildFinanceProps,
  mapProductFormToCreatePayload,
  mapShopToProfileForm,
  mapVoucherFormToCreateCouponPayload,
} from './seller-page-adapters'

void test('mapVoucherFormToCreateCouponPayload builds seller coupon payload from voucher form', () => {
  const form: VoucherDetailFormData = {
    code: 'lumen10',
    type: 'PERCENT',
    value: '10',
    minSpend: '50',
    quota: '100',
    perBuyerLimit: '2',
    startsAt: '2026-05-27T08:30',
    endsAt: '2026-06-30T23:59',
  }

  const payload = mapVoucherFormToCreateCouponPayload(form)

  assert.equal(payload.code, 'LUMEN10')
  assert.equal(payload.name, 'LUMEN10')
  assert.equal(payload.type, 'PERCENTAGE')
  assert.equal(payload.scope, 'ALL_PRODUCTS')
  assert.equal(payload.discountValue, 10)
  assert.equal(payload.minOrderAmount, 50)
  assert.equal(payload.usageLimit, 100)
  assert.equal(payload.usageLimitPerUser, 2)
  assert.equal(new Date(payload.startsAt).toISOString(), payload.startsAt)
  assert.equal(new Date(payload.expiresAt).toISOString(), payload.expiresAt)
})

void test('mapProductFormToCreatePayload converts product editor form into create payload', () => {
  const form: ProductDetailFormData = {
    name: 'Studio Headphones',
    category: 'Audio',
    brand: 'Lumen',
    shortDescription: 'ANC ready',
    fullDescription: 'Long-form description',
    status: 'DRAFT',
    media: [{ id: 'm1', url: 'https://example.com/image.jpg', alt: 'Cover' }],
    optionGroups: [{ id: 'color', name: 'Color', values: ['Black', 'White'] }],
    variantSeeds: [
      { key: 'Black', sku: 'SKU-BLK', price: '199', stock: '10' },
      { key: 'White', sku: 'SKU-WHT', price: '209', stock: '5' },
    ],
    weightKg: '0.4',
    lengthCm: '20',
    widthCm: '18',
    heightCm: '8',
    shippingMethods: [{ id: 'standard', label: 'Standard', checked: true }],
    slug: 'studio-headphones',
    metaTitle: '',
    metaDescription: '',
    visibility: [{ id: 'storefront', label: 'Storefront', checked: true }],
    validationItems: [{ id: 'core', label: 'Core', complete: true }],
  }

  const payload = mapProductFormToCreatePayload(
    form,
    [{ id: 'cat-1', name: 'Audio', children: [] }],
    'PUBLISHED',
  )

  assert.equal(payload.name, 'Studio Headphones')
  assert.equal(payload.categoryId, 'cat-1')
  assert.equal(payload.basePrice, 199)
  assert.equal(payload.baseStock, 10)
  assert.equal(payload.weight, 400)
  assert.equal(payload.hasVariants, true)
  assert.equal(payload.status, 'PUBLISHED')
  assert.deepEqual(payload.variantOptionGroups?.[0], {
    name: 'Color',
    options: [{ value: 'Black' }, { value: 'White' }],
  })
  assert.deepEqual(payload.variants?.[0], {
    sku: 'SKU-BLK',
    price: 199,
    stock: 10,
    optionValues: ['Black'],
  })
})

void test('buildDashboardProps maps seller API aggregates into dashboard view props', () => {
  const props = buildDashboardProps({
    summary: {
      revenue: { current: 3200, previous: 2800, growth: 14.3 },
      pendingOrders: 5,
      activeProducts: 12,
      lowStockCount: 2,
    },
    revenue: {
      totalRevenue: 3200,
      orderCount: 18,
      averageOrderValue: 177.77,
      dailyRevenue: [
        { date: '2026-05-20T00:00:00.000Z', revenue: 1200 },
        { date: '2026-05-21T00:00:00.000Z', revenue: 2000 },
      ],
    },
    orders: {
      total: 18,
      byStatus: [
        { status: 'PENDING', count: 5 },
        { status: 'DELIVERED', count: 13 },
      ],
    },
    topProducts: [
      { variantId: 'v1', unitsSold: 22, revenue: 1200, orders: 8, productName: 'Headphones' },
    ],
    lowStockItems: [
      {
        variantId: 'v1',
        productId: 'p1',
        productName: 'Headphones',
        sku: 'HP-1',
        stock: 4,
        reservedStock: 1,
      },
    ],
    unreadCount: { count: 3 },
    notifications: [
      {
        id: 'n1',
        title: 'Low stock',
        message: 'Headphones running low',
        createdAt: '2026-05-21T10:00:00.000Z',
      },
    ],
    pendingOrders: [
      {
        id: 'so-1',
        status: 'PENDING',
        createdAt: '2026-05-21T10:00:00.000Z',
        totalAmount: 199,
        order: { id: 'ORD-1', shippingName: 'Ava' },
        items: [],
      },
    ],
    returnStats: { total: 1, open: 1, approved: 0, refunded: 0, rejected: 0 },
  })

  assert.equal(props.metrics?.length, 4)
  assert.equal(props.todos?.[1]?.count, 2)
  assert.equal(props.pendingOrders?.[0]?.customer, 'Ava')
  assert.equal(props.topProducts?.[0]?.name, 'Headphones')
})

void test('buildAnalyticsProps creates analytics sections from seller endpoints', () => {
  const props = buildAnalyticsProps({
    range: '30d',
    revenue: {
      totalRevenue: 5000,
      orderCount: 25,
      averageOrderValue: 200,
      dailyRevenue: [
        { date: '2026-05-01T00:00:00.000Z', revenue: 1000 },
        { date: '2026-05-02T00:00:00.000Z', revenue: 4000 },
      ],
    },
    orders: {
      total: 25,
      byStatus: [
        { status: 'DELIVERED', count: 20 },
        { status: 'CANCELLED', count: 5 },
      ],
    },
    topProducts: [
      { variantId: 'v1', unitsSold: 12, revenue: 2400, orders: 5, productName: 'Headphones' },
    ],
    conversion: {
      totalOrders: 25,
      deliveredOrders: 20,
      cancelledOrders: 5,
      fulfillmentRate: 80,
      cancellationRate: 20,
    },
  })

  assert.equal(props.dateRange, '30d')
  assert.equal(props.metrics?.[0]?.value, '$5,000')
  assert.equal(props.trafficSources?.[0]?.label, 'Delivered')
  assert.equal(props.topProducts?.[0]?.name, 'Headphones')
})

void test('buildFinanceProps combines wallet balances and ledger rows', () => {
  const props = buildFinanceProps({
    wallet: { balance: 1500, pendingBalance: 200 },
    transactions: [
      {
        id: 'txn-1',
        type: 'SALE_CREDIT',
        amount: 200,
        description: 'Order ORD-1',
        createdAt: '2026-05-21T10:00:00.000Z',
      },
    ],
    withdrawals: [
      {
        id: 'wd-1',
        amount: 300,
        bankName: 'Vietcombank',
        createdAt: '2026-05-22T10:00:00.000Z',
      },
    ],
  })

  assert.equal(props.walletBalance, 1500)
  assert.equal(props.balanceMetrics?.[1]?.amount, 200)
  assert.equal(props.entries?.length, 2)
  assert.equal(props.entries?.[1]?.tab, 'PAYOUTS')
})

void test('mapShopToProfileForm derives visible profile fields from seller shop payload', () => {
  const form = mapShopToProfileForm({
    name: 'Lumen Audio',
    slug: 'lumen-audio',
    description: 'Studio-grade audio. Crafted for creators.',
    logo: 'https://example.com/logo.png',
    banner: 'https://example.com/banner.png',
    phone: '+84 123 456',
    email: 'support@example.com',
    country: 'VN',
  })

  assert.equal(form.shopName, 'Lumen Audio')
  assert.equal(form.slug, 'lumen-audio')
  assert.equal(form.tagline, 'Studio-grade audio')
  assert.equal(form.previewUrl, 'halomarket.co/shop/lumen-audio')
  assert.equal(form.country, 'VN')
})
