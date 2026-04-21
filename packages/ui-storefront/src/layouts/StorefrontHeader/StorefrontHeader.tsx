import React from 'react'

import { StorefrontHeaderClient } from './StorefrontHeaderClient'

// Re-export props interface so consumers have a single import point
export type { StorefrontHeaderClientProps as StorefrontHeaderProps } from './StorefrontHeaderClient'

export function StorefrontHeader(props: React.ComponentProps<typeof StorefrontHeaderClient>) {
  return <StorefrontHeaderClient {...props} />
}
