import React from 'react'

import { CheckCircle2 } from 'lucide-react'

import { cn } from '@ecom/ui'

import { Rating } from '../../atoms/Rating/Rating'

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string
  avatar?: string
  rating: number
  date: string
  content: string
  verified?: boolean
  title?: string
}

function ReviewCard({
  author,
  avatar,
  rating,
  date,
  content,
  verified = false,
  title,
  className,
  ...props
}: ReviewCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const isLong = content.length > 220
  const displayContent = !expanded && isLong ? content.slice(0, 220) + '…' : content

  // Generate a stable color from the author's initial for the avatar fallback
  const initials = author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        'p-[var(--padding-card)] rounded-[var(--radius-lg)]',
        'bg-card border shadow-[var(--elevation-card)]',
        'transition-shadow duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
        'hover:shadow-[var(--elevation-hover)]',
        className,
      )}
      {...props}
    >
      {/* Rating + Date row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <Rating value={rating} size="sm" />
          {title && <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>}
        </div>
        <span className="text-[var(--text-micro)] text-muted-foreground whitespace-nowrap mt-0.5">
          {date}
        </span>
      </div>

      {/* Content with decorative quote */}
      <div className="relative flex-1">
        <p className="text-sm text-foreground/80 leading-relaxed">{displayContent}</p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1.5 text-xs font-semibold text-brand hover:text-brand/80 transition-colors duration-[var(--motion-fast)]"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 mt-auto border-t border-border/60">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-border"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-muted to-muted/60 border border-border flex items-center justify-center text-xs font-bold text-foreground/60 shrink-0">
            {initials}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold leading-tight truncate">{author}</span>
          {verified && (
            <span className="flex items-center gap-1 text-[var(--text-micro)] text-[var(--text-success)] font-medium mt-0.5">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              Verified Buyer
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export { ReviewCard }
