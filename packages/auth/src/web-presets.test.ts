import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { getWebAuthPreset } from './web-presets'

void test('getWebAuthPreset returns admin auth overrides', () => {
  const preset = getWebAuthPreset('admin')

  assert.equal(preset.client.apiUrl, '/api')
  assert.equal(preset.client.meEndpoint, '/admin/auth/me')
  assert.equal(preset.client.loginEndpoint, '/admin/auth/login')
  assert.equal(preset.client.logoutEndpoint, '/admin/auth/logout')
  assert.equal(preset.middleware.apiUrl, 'http://localhost:4002')
  assert.equal(preset.middleware.meEndpoint, undefined)
  assert.deepEqual(preset.middleware.publicPaths, ['/login', '/api'])
  assert.equal(preset.middleware.loginPath, '/login')
  assert.equal(preset.protectedRoute, undefined)
})

void test('getWebAuthPreset returns seller auth restrictions', () => {
  const preset = getWebAuthPreset('seller')

  assert.equal(preset.client.apiUrl, '/api')
  assert.equal(preset.client.meEndpoint, '/auth/me')
  assert.equal(preset.client.loginEndpoint, '/auth/login')
  assert.equal(preset.client.logoutEndpoint, '/auth/logout')
  assert.equal(preset.client.requireSeller, true)
  assert.equal(preset.client.forbiddenRedirectTo, '/')
  assert.equal(preset.client.logoutRedirectTo, '/login')
  assert.equal(preset.middleware.apiUrl, 'http://localhost:4003')
  assert.equal(preset.middleware.meEndpoint, undefined)
  assert.equal(preset.middleware.requireSeller, true)
  assert.equal(preset.middleware.forbiddenRedirectTo, '/login')
  assert.deepEqual(preset.middleware.publicPaths, [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api',
  ])
  assert.equal(preset.protectedRoute?.requireSeller, true)
  assert.equal(preset.protectedRoute?.redirectTo, '/login')
  assert.equal(preset.protectedRoute?.forbiddenRedirectTo, '/')
})

void test('getWebAuthPreset returns storefront redirects', () => {
  const preset = getWebAuthPreset('storefront')

  assert.equal(preset.client.apiUrl, 'http://localhost:4000')
  assert.equal(preset.middleware.apiUrl, 'http://localhost:4000')
  assert.deepEqual(preset.middleware.publicPaths, [
    '/',
    '/products',
    '/search',
    '/login',
    '/register',
  ])
  assert.equal(preset.middleware.loginPath, '/login')
  assert.equal(preset.protectedRoute?.redirectTo, '/login')
  assert.equal(preset.protectedRoute?.forbiddenRedirectTo, '/')

  assert.equal(preset.protectedRoute?.onForbiddenRedirect?.({ userId: 'buyer-1' }), '/')
  assert.equal(
    preset.protectedRoute?.onForbiddenRedirect?.({
      userId: 'seller-1',
      sellerProfile: { id: 'shop-1' },
    }),
    '/seller/dashboard',
  )
})
