import type { StorybookConfig } from '@storybook/react-vite'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: [
    '../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/ui/src/**/*.mdx',
    '../packages/ui-admin/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/ui-admin/src/**/*.mdx',
    '../packages/ui-storefront/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/ui-storefront/src/**/*.mdx',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: [],
}

export default config
