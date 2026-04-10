import React from 'react'
import type { Preview, Decorator } from '@storybook/react'
import '../../packages/ui/src/theme/tokens.css'

const withThemeProvider: Decorator = (Story, context) => {
  return React.createElement(Story, context.args)
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
  decorators: [withThemeProvider],
}

export default preview
