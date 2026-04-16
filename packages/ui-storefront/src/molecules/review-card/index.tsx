import { CheckCircle2 } from 'lucide-react'

import { cn } from '@ecom/ui'

import { Rating } from '../../atoms/rating'

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string
  avatar?: string
  rating: number
  date: string
  content: string
  verified?: boolean
}

function ReviewCard({
  author,
  avatar,
  rating,
  date,
  content,
  verified = false,
  className,
  ...props
}: ReviewCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        // Token-based radius + shadow
        'p-[var(--padding-card)] rounded-[var(--radius-lg)]',
        'bg-card border shadow-[var(--elevation-card)]',
        // Shadow transition
        'transition-shadow duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
        'hover:shadow-[var(--elevation-hover)]',
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <Rating value={rating} size="sm" className="mb-2" />
        <span className="text-[var(--text-micro)] text-muted-foreground">{date}</span>
      </div>

      <div className="flex-1">
        <p className="text-[var(--text-sm)] text-foreground/90 leading-relaxed line-clamp-4">
          "{content}"
        </p>
      </div>

      <div className="flex items-center gap-3 pt-3 mt-auto border-t">
        {avatar ? (
          <img src={avatar} alt={author} className="w-8 h-8 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[var(--text-micro)] font-medium text-muted-foreground shrink-0">
            {author.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[var(--text-sm)] font-semibold leading-tight">{author}</span>
          {verified && (
            <span className="flex items-center gap-1 text-[var(--text-micro)] text-success font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Verified Buyer
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export { ReviewCard }
