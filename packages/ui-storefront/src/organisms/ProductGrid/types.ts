import type { ProductBadgeProps } from '../../atoms/Badge/Badge'

export interface Product {
  id: string
  image: string
  title: string
  price: number
  originalPrice?: number
  badge?: React.ReactNode
  badgeVariant?: ProductBadgeProps['variant']
  rating?: number
  ratingCount?: number
  buyCount?: number
}

export interface ProductGridProps {
  products: Product[]
  onAddToCart?: (id: string) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
  view?: 'grid' | 'list'
  loadingCount?: number
}
