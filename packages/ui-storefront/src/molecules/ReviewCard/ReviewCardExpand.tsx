'use client'

import { useState } from 'react'

import { Button } from '@ecom/ui'

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
    <Button
      type="button"
      variant="link"
      size="sm"
      onClick={() => {
        const next = !expanded
        setExpanded(next)
        onToggle(next)
      }}
      className="mt-1.5 h-auto min-h-0 p-0 text-xs font-semibold text-brand hover:text-brand/80"
    >
      {expanded ? 'Show less' : 'Read more'}
    </Button>
  )
}
