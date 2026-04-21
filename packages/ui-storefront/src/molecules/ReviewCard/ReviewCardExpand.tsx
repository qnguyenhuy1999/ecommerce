'use client'

import { useState } from 'react'

// ─── Client leaf: expand/collapse toggle ─────────────────────────────────────
interface ReviewCardExpandProps {
  content: string
  truncatedContent: string
  onToggle: (expanded: boolean) => void
}

export function ReviewCardExpand({ content, onToggle }: ReviewCardExpandProps) {
  const [expanded, setExpanded] = useState(false)
  const isLong = content.length > 220

  if (!isLong) return null

  return (
    <button
      type="button"
      onClick={() => {
        const next = !expanded
        setExpanded(next)
        onToggle(next)
      }}
      className="mt-1.5 text-xs font-semibold text-brand hover:text-brand/80 transition-colors duration-[var(--motion-fast)]"
    >
      {expanded ? 'Show less' : 'Read more'}
    </button>
  )
}
