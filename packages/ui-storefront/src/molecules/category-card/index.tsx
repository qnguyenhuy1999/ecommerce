import * as React from 'react'
import { cn } from '@ecom/ui'

export interface CategoryCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string
  image: string
  href: string
  itemCount?: number
}

function CategoryCard({ title, image, href, itemCount, className, ...props }: CategoryCardProps) {
  return (
    <a 
      href={href}
      className={cn("category-card block aspect-[4/5] bg-muted group", className)}
      {...props}
    >
      <img 
        src={image} 
        alt={title} 
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="category-card__overlay">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold tracking-tight text-white mb-1 group-hover:scale-105 transition-transform origin-bottom-left">
            {title}
          </h3>
          {itemCount !== undefined && (
            <p className="text-sm font-medium text-white/80">
              {itemCount} Items
            </p>
          )}
        </div>
      </div>
    </a>
  )
}

export { CategoryCard }
