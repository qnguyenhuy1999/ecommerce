import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

void test('root @ecom/auth import resolves to source during workspace development', () => {
  const packageJsonPath = join(import.meta.dirname, '..', 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    exports?: { '.': { import?: string } }
  }

  assert.equal(packageJson.exports?.['.']?.import, './src/index.ts')
})
