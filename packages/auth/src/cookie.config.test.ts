import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { getSessionCookieOptions } from './cookie.config'

void test('getSessionCookieOptions ignores invalid localhost placeholder domains', () => {
  const cookieOptions = getSessionCookieOptions('.')

  assert.equal(cookieOptions.domain, undefined)
})
