import type { Preview } from '@storybook/react'

import '../src/theme/tokens.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
}

export default preview
