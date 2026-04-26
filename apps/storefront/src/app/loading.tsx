/**
 * Default route-level loading UI for the storefront. Streams immediately while
 * Server Components fetch their data — keeps the UI responsive on slow links.
 */
export default function Loading() {
  return (
    <div
      aria-busy
      className="min-h-[60vh] animate-pulse bg-[var(--surface-muted)]"
    />
  )
}
