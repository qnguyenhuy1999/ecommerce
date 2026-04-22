import { FileText, Settings, User, Package, ShoppingCart } from 'lucide-react'

// Exported for consumers and tests
export const COMMAND_PALETTE_DEFAULT_ICONS = {
  page: <FileText className="w-4 h-4" />,
  action: <Settings className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
  product: <Package className="w-4 h-4" />,
  order: <ShoppingCart className="w-4 h-4" />,
} as const
