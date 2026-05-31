/**
 * Generates TypeScript const assertion enums from the Prisma schema.
 *
 * Reads all `enum <Name> { ... }` blocks from schema.prisma and emits:
 *   export const WorkOrderType = { ... } as const
 *   export type WorkOrderType = typeof WorkOrderType[keyof typeof WorkOrderType]
 *   export const WORK_ORDER_TYPE_VALUES = [...] as const  (PascalCase name -> UPPER_SNAKE_CASE)
 *
 * Output is written to packages/contracts/src/generated/enums.ts.
 *
 * Run via: pnpm generate:enums
 * (hooked into postinstall after prisma generate)
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const packageRoot = process.cwd()
const repoRoot = join(packageRoot, '..', '..')

const schemaPath = join(repoRoot, 'packages', 'database', 'prisma', 'schema.prisma')
const typesOutputPath = join(repoRoot, 'packages', 'contracts', 'src', 'generated', 'enums.ts')

const schema = readFileSync(schemaPath, 'utf-8')

const enumBlockRegex = /^enum\s+(\w+)\s*\{([^}]*)\}/gm
const enums: { name: string; values: string[] }[] = []

let match: RegExpExecArray | null
while ((match = enumBlockRegex.exec(schema)) !== null) {
  const name = match[1]!
  const body = match[2]!
  const values = body
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && !v.startsWith('//'))
  enums.push({ name, values })
}

const header =
  '/**\n' +
  ' * Auto-generated from packages/database/prisma/schema.prisma\n' +
  ' * DO NOT EDIT MANUALLY — run: pnpm --filter @ecom/database generate:enums\n' +
  ' */\n\n'

const blocks = enums.map(({ name, values }) => {
  const objectLine = values.map((v) => '  ' + v + ": '" + v + "',").join('\n')
  const valuesLine = values.map((v) => '  ' + name + '.' + v + ',').join('\n')
  const upperName = name
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '')
  return (
    'export const ' +
    name +
    ' = {\n' +
    objectLine +
    '\n} as const\nexport type ' +
    name +
    ' = (typeof ' +
    name +
    ')[keyof typeof ' +
    name +
    ']\n\nexport const ' +
    upperName +
    '_VALUES = [\n' +
    valuesLine +
    '\n] as const'
  )
})

const output = header + blocks.join('\n\n') + '\n'

writeFileSync(typesOutputPath, output, 'utf-8')
execFileSync(
  join(repoRoot, 'node_modules', '.bin', 'prettier'),
  ['--write', '--log-level', 'warn', typesOutputPath],
  {
    cwd: repoRoot,
    stdio: 'inherit',
  },
)

console.log('Generated ' + enums.length + ' enums -> ' + typesOutputPath)
