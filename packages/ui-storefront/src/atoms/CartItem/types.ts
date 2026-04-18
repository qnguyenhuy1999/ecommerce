export interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
  }
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
  className?: string
}
