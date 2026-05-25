export interface ProductCardData {
  id: string
  name: string
  imageUrl: string
  price: string
  originalPrice?: string
  discount?: string
  rating?: string
  sold?: string
  soldPercent?: number
  stockLabel?: string
  mall?: boolean
  freeShipping?: boolean
  flash?: boolean
}

export interface ProductCardProps {
  product: ProductCardData
  compact?: boolean
}
