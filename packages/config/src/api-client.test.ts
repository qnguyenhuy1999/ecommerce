import assert from 'node:assert/strict'
import test from 'node:test'

import { createWebApiClient, getWebApiBaseUrl } from './api-client.ts'

void test('getWebApiBaseUrl returns app-specific defaults', () => {
  assert.equal(getWebApiBaseUrl('admin'), 'http://localhost:4002')
  assert.equal(getWebApiBaseUrl('seller'), 'http://localhost:4003')
  assert.equal(getWebApiBaseUrl('storefront'), 'http://localhost:4000')
})

void test('getWebApiBaseUrl prefers configured public env vars', () => {
  const previousAdminUrl = process.env['NEXT_PUBLIC_ADMIN_API_URL']
  const previousSellerUrl = process.env['NEXT_PUBLIC_SELLER_API_URL']
  const previousStorefrontUrl = process.env['NEXT_PUBLIC_API_URL']

  process.env['NEXT_PUBLIC_ADMIN_API_URL'] = 'https://admin.example.test'
  process.env['NEXT_PUBLIC_SELLER_API_URL'] = 'https://seller.example.test'
  process.env['NEXT_PUBLIC_API_URL'] = 'https://storefront.example.test'

  assert.equal(getWebApiBaseUrl('admin'), 'https://admin.example.test')
  assert.equal(getWebApiBaseUrl('seller'), 'https://seller.example.test')
  assert.equal(getWebApiBaseUrl('storefront'), 'https://storefront.example.test')

  restoreEnv('NEXT_PUBLIC_ADMIN_API_URL', previousAdminUrl)
  restoreEnv('NEXT_PUBLIC_SELLER_API_URL', previousSellerUrl)
  restoreEnv('NEXT_PUBLIC_API_URL', previousStorefrontUrl)
})

function createSuccessfulFetchMock(
  calls: Array<{ input: RequestInfo | URL; init?: RequestInit }>,
): typeof fetch {
  return (input, init) => {
    calls.push(init === undefined ? { input } : { input, init })
    return Promise.resolve(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }
}

void test('createWebApiClient uses the preset base url', async () => {
  const previousFetch = globalThis.fetch
  const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []

  globalThis.fetch = createSuccessfulFetchMock(calls)

  const client = createWebApiClient('seller')
  await client('/orders', { params: { page: 2 } })

  assert.equal(calls[0]?.input, 'http://localhost:4003/orders?page=2')

  globalThis.fetch = previousFetch
})

void test('createWebApiClient deduplicates identical in-flight GET requests', async () => {
  const previousFetch = globalThis.fetch
  const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []
  let resolveResponse: ((value: Response) => void) | undefined

  const fetchMock: typeof fetch = (input, init) => {
    calls.push(init === undefined ? { input } : { input, init })

    return new Promise<Response>((resolve) => {
      resolveResponse = resolve
    })
  }

  globalThis.fetch = fetchMock

  const client = createWebApiClient('seller')
  const firstRequest = client('/orders', { params: { page: 1 } })
  const secondRequest = client('/orders', { params: { page: 1 } })

  resolveResponse?.(
    new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  )

  const [firstResult, secondResult] = await Promise.all([firstRequest, secondRequest])

  assert.deepEqual(firstResult, { ok: true })
  assert.deepEqual(secondResult, { ok: true })
  assert.equal(calls.length, 1)

  globalThis.fetch = previousFetch
})

void test('createWebApiClient does not deduplicate non-GET requests', async () => {
  const previousFetch = globalThis.fetch
  const calls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = []

  const fetchMock: typeof fetch = (input, init) => {
    calls.push(init === undefined ? { input } : { input, init })
    return Promise.resolve(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }

  globalThis.fetch = fetchMock

  const client = createWebApiClient('seller')
  await Promise.all([
    client('/messages', { method: 'POST', body: JSON.stringify({ content: 'hello' }) }),
    client('/messages', { method: 'POST', body: JSON.stringify({ content: 'hello' }) }),
  ])

  assert.equal(calls.length, 2)

  globalThis.fetch = previousFetch
})

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key]
    return
  }

  process.env[key] = value
}
