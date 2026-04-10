export interface Product {
  id: string
  image: string
  title: string
  price: number
  originalPrice?: number
  badge?: React.ReactNode
}

export interface ProductGridProps {
  products: Product[]
  onAddToCart?: (id: string) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}
