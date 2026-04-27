import type { ProductDetailView } from '../../../product/presentation/mappers/product-response.mapper'

export interface SellerLedgerEntryView {
  id: string
  type: string
  amount: number
  referenceType: string | null
  referenceId: string | null
  description: string | null
  createdAt: string
}

export interface SellerInventoryRowView {
  productId: string
  productName: string
  variantId: string
  sku: string
  attributes: Record<string, unknown>
  stock: number
  reservedStock: number
  availableStock: number
}

export interface SellerConsoleView {
  seller: {
    id: string
    storeName: string
    storeDescription: string | null
    kycStatus: string
    commissionRate: number
    rating: number
    totalRatings: number
  }
  metrics: {
    products: number
    activeProducts: number
    pendingOrders: number
    revenue: number
    commission: number
    availableBalance: number
  }
  products: ProductDetailView[]
  inventory: SellerInventoryRowView[]
  ledger: SellerLedgerEntryView[]
}
