import {
  BarChart2,
  Bell,
  ClipboardCheck,
  DollarSign,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Package,
  RefreshCcw,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Truck,
  Upload,
  Ticket,
  TrendingUp,
  Warehouse,
} from 'lucide-react'

import type { SidebarGroup } from '@ecom/core-ui/organisms/Sidebar'

export const sidebarGroups: SidebarGroup[] = [
  {
    id: 'main',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' }],
  },
  {
    id: 'manage',
    label: 'Manage',
    items: [
      { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/orders' },
      { id: 'products', label: 'Products', icon: Package, href: '/products' },
      { id: 'inventory', label: 'Inventory', icon: Warehouse, href: '/inventory' },
      { id: 'shipping', label: 'Shipping', icon: Truck, href: '/shipping' },
      { id: 'returns', label: 'Returns', icon: RefreshCcw, href: '/returns' },
      { id: 'bulk', label: 'Bulk Operations', icon: Upload, href: '/bulk' },
      { id: 'warehouses', label: 'Warehouses', icon: Warehouse, href: '/warehouses' },
      { id: 'approvals', label: 'Approvals', icon: ClipboardCheck, href: '/approvals' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { id: 'promotions', label: 'Promotions', icon: Megaphone, href: '/promotions' },
      { id: 'vouchers', label: 'Vouchers', icon: Ticket, href: '/vouchers' },
      { id: 'storefront', label: 'Storefront', icon: Store, href: '/storefront' },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart2, href: '/analytics' },
      { id: 'finance', label: 'Finance', icon: DollarSign, href: '/finance' },
      { id: 'metrics', label: 'Performance', icon: TrendingUp, href: '/metrics' },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    items: [
      { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages' },
      { id: 'reviews', label: 'Reviews', icon: Star, href: '/reviews' },
      { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    ],
  },
  {
    id: 'system',
    items: [
      { id: 'shop-profile', label: 'Shop profile', icon: Tag, href: '/shop-profile' },
      { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
    ],
  },
]
