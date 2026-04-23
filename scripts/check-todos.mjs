import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const WORKSPACE_ROOT = process.cwd()

const ROOT_DIRS = ['apps', 'packages']
const ALLOWED_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx'])

const IGNORE_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  '.next',
  'storybook-static',
  '.turbo',
  'coverage',
  'generated',
])

const TODO_KEYWORDS = ['TODO', 'FIXME', 'HACK']

const ALLOWED_TODO_FORMAT =
  /^(TODO|FIXME|HACK)\((#\d+|[A-Z][A-Z0-9]+-\d+|@[a-zA-Z0-9_-]+, \d{4}-\d{2}-\d{2})\):\s+\S/

async function* walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIR_NAMES.has(entry.name)) continue
      yield* walkFiles(path.join(dir, entry.name))
      continue
    }

    const ext = path.extname(entry.name)
    if (!ALLOWED_EXTS.has(ext)) continue

    yield path.join(dir, entry.name)
  }
}

function isLikelyCommentLine(line, keywordIndex) {
  const trimmed = line.trimStart()
  if (trimmed.startsWith('//')) return true
  if (trimmed.startsWith('/*')) return true
  if (trimmed.startsWith('*')) return true

  const lineCommentIndex = line.indexOf('//')
  if (lineCommentIndex !== -1 && lineCommentIndex < keywordIndex) return true

  const blockCommentIndex = line.indexOf('/*')
  if (blockCommentIndex !== -1 && blockCommentIndex < keywordIndex) return true

  return false
}

function validateTodoLine(line) {
  for (const keyword of TODO_KEYWORDS) {
    const keywordIndex = line.indexOf(keyword)
    if (keywordIndex === -1) continue
    if (!isLikelyCommentLine(line, keywordIndex)) continue

    const fromKeyword = line.slice(keywordIndex).trimEnd()
    if (!ALLOWED_TODO_FORMAT.test(fromKeyword)) {
      return fromKeyword
    }
  }
  return null
}

async function main() {
  const violations = []

  for (const rootDir of ROOT_DIRS) {
    const absRoot = path.join(WORKSPACE_ROOT, rootDir)
    for await (const filePath of walkFiles(absRoot)) {
      const text = await readFile(filePath, 'utf8')
      const lines = text.split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        const bad = validateTodoLine(lines[i])
        if (bad) {
          violations.push({ filePath, line: i + 1, snippet: bad })
        }
      }
    }
  }

  if (violations.length > 0) {
    // eslint-disable-next-line no-console -- CI-friendly output for fixing TODO format violations.
    console.error('Untracked TODO/FIXME/HACK comments found (must be traceable):\n')
    for (const v of violations) {
      // eslint-disable-next-line no-console -- CI-friendly output for fixing TODO format violations.
      console.error(`${path.relative(WORKSPACE_ROOT, v.filePath)}:${v.line} ${v.snippet}`)
    }
    process.exit(1)
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console -- Fail fast if checker crashes.
  console.error(err)
  process.exit(1)
})

