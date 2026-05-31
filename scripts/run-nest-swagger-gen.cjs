const { spawnSync } = require('node:child_process')
const path = require('node:path')

const env = {
  ...process.env,
  GENERATE_SWAGGER: 'true',
  NODE_OPTIONS: [process.env.NODE_OPTIONS, '-r @swc-node/register'].filter(Boolean).join(' '),
  SWC_NODE_PROJECT: path.join(process.cwd(), 'tsconfig.build.json'),
}

const nestBin = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'nest.CMD' : 'nest',
)

const result =
  process.platform === 'win32'
    ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', `${nestBin} start --entryFile generate-openapi`], {
        stdio: 'inherit',
        env,
      })
    : spawnSync(nestBin, ['start', '--entryFile', 'generate-openapi'], {
        stdio: 'inherit',
        env,
      })

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
