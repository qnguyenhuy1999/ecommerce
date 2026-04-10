export interface CartItemData {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItemData[]
  total: number
  onCheckout?: () => void
  onRemoveItem?: (id: string) => void
  onUpdateQuantity?: (id: string, quantity: number) => void
  loading?: boolean
  className?: string
}
