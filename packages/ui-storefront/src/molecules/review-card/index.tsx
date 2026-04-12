import * as React from 'react'
import { cn } from '@ecom/ui'
import { Rating } from '../../atoms/rating'
import { CheckCircle2 } from 'lucide-react'

export interface ReviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  author: string
  avatar?: string
  rating: number
  date: string
  content: string
  verified?: boolean
}

function ReviewCard({ author, avatar, rating, date, content, verified = false, className, ...props }: ReviewCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 p-5 rounded-[20px] bg-card border shadow-sm", className)} {...props}>
      <div className="flex justify-between items-start">
        <Rating value={rating} size="sm" className="mb-2" />
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4">
          "{content}"
        </p>
      </div>
      
      <div className="flex items-center gap-3 pt-3 mt-auto border-t">
        {avatar ? (
          <img src={avatar} alt={author} className="w-8 h-8 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
            {author.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">{author}</span>
          {verified && (
            <span className="flex items-center gap-1 text-[11px] text-success font-medium">
              <CheckCircle2 className="w-3 h-3" /> Verified Buyer
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export { ReviewCard }
