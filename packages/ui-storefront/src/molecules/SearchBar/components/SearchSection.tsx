import type React from 'react'

export interface SearchSectionProps {
  title: string
  children: React.ReactNode
}

export function SearchSection({ title, children }: SearchSectionProps) {
  return (
    <div className="pb-1 last:pb-0">
      <div className="px-4 pt-2 pb-1 text-[length:var(--text-micro)] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        {title}
      </div>
      {children}
    </div>
  )
}
