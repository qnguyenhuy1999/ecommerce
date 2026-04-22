import * as React from 'react'

/**
 * Creates a strict React context with a named guard hook.
 * Throws a descriptive error when the hook is used outside its provider.
 *
 * @example
 * const [Provider, useGallery] = createStrictContext<GalleryCtx>('ProductGallery')
 */
export function createStrictContext<T>(displayName: string) {
  const Ctx = React.createContext<T | null>(null)
  Ctx.displayName = displayName

  function useCtx(): T {
    const v = React.useContext(Ctx)
    if (v === null) {
      throw new Error(`use${displayName} must be used within <${displayName}>`)
    }
    return v
  }

  return [Ctx.Provider, useCtx, Ctx] as const
}
