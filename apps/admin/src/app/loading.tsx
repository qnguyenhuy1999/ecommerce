/**
 * Default route-level loading UI for the admin app. Streams immediately so the
 * sidebar/header chrome paints while heavier dashboard widgets hydrate.
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] p-[var(--space-6)]">
      <div className="mb-[var(--space-4)] h-8 w-64 animate-pulse rounded bg-[var(--surface-muted)]" />
      <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-[var(--surface-muted)]"
          />
        ))}
      </div>
    </div>
  )
}
