import * as React from 'react'
import { cn } from '@ecom/ui'
import { CategoryCard } from '../../molecules/category-card'

export interface CategoryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: {
    title: string
    image: string
    href: string
    itemCount?: number
  }[]
  columns?: 2 | 3 | 4
}

function CategoryGrid({ categories, columns = 3, className, ...props }: CategoryGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={cn("grid gap-[var(--storefront-grid-gap)]", gridClasses, className)} {...props}>
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          title={category.title}
          image={category.image}
          href={category.href}
          itemCount={category.itemCount}
        />
      ))}
    </div>
  )
}

export { CategoryGrid }
