export interface ProductCardProps {
  id: string
  image: string
  title: string
  price: number
  originalPrice?: number
  badge?: React.ReactNode
  onAddToCart?: (id: string) => void
  loading?: boolean
  className?: string
}
