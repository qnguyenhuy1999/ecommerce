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
      className={cn('category-card block bg-muted group relative overflow-hidden', className)}
      {...props}
    >
      {/* Image with subtle zoom on hover */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className={cn(
          'w-full h-full object-cover',
          // Zoom on hover using token duration
          'group-hover:scale-105',
          'transition-transform duration-[var(--motion-normal)] ease-[var(--motion-ease-out)]',
        )}
      />

      {/* Overlay — dark gradient for text legibility */}
      <div className="category-card__overlay absolute inset-0 flex items-end p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
        <div className="flex flex-col">
          {/* Title: token-based size + scale on hover */}
          <h3
            className={cn(
              'font-bold tracking-tight text-white mb-1',
              'text-[var(--text-xl)]',
              // Scale transform using token scale value
              'group-hover:scale-105',
              'transition-transform duration-[var(--motion-fast)] ease-[var(--motion-ease-default)]',
              'origin-bottom-left',
            )}
          >
            {title}
          </h3>
          {itemCount !== undefined && (
            <p className="text-[var(--text-sm)] font-medium text-white/80">{itemCount} Items</p>
          )}
        </div>
      </div>
    </a>
  )
}

export { CategoryCard }
