import { mergeConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@': '/src',
        },
      },
    })
  },
}
