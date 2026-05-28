import assert from 'node:assert/strict'
import test from 'node:test'

import { getSessionCookieOptions } from './cookie.config.ts'

void test('getSessionCookieOptions ignores invalid localhost placeholder domains', () => {
  const cookieOptions = getSessionCookieOptions('.')

  assert.equal(cookieOptions.domain, undefined)
})
