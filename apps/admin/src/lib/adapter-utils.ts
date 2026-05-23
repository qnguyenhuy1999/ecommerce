export function stripAdapterMeta<T extends { loading: boolean; error: Error | null }>(
  adapter: T,
): Omit<T, 'loading' | 'error'> {
  const result = { ...adapter } as Record<string, unknown>
  delete result.loading
  delete result.error
  return result as Omit<T, 'loading' | 'error'>
}
