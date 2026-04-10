import { addons } from '@storybook/addons'
import { create } from '@storybook/theming/create'

const theme = create({
  base: 'light',
  brandTitle: '@ecom/ui — Design System',
  brandUrl: '/',
  brandTarget: '_self',
  colorPrimary: '#09090b',
  colorSecondary: '#09090b',
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appBorderColor: '#e4e4e7',
  appBorderRadius: 8,
})

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
  },
})
