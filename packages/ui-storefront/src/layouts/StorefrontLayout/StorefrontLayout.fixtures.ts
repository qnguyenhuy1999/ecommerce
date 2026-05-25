import type { StorefrontFooterColumn, StorefrontNavItem } from './StorefrontLayout.types'

export const storefrontUtilityLinks: StorefrontNavItem[] = [
  { label: 'Sell on Halo' },
  { label: 'Track order' },
  { label: 'Help' },
]

export const storefrontNavigation: StorefrontNavItem[] = [
  { label: 'All categories' },
  { label: 'Electronics' },
  { label: 'Fashion' },
  { label: 'Home & Living' },
  { label: 'Beauty' },
  { label: 'Grocery' },
  { label: 'Sports' },
  { label: 'Toys & Kids' },
  { label: 'Mobile' },
  { label: 'Audio' },
  { label: 'Auto' },
]

export const storefrontFooterColumns: StorefrontFooterColumn[] = [
  {
    title: 'Shop',
    links: [{ label: 'Flash sale' }, { label: 'New arrivals' }, { label: 'Top picks' }, { label: 'Gift cards' }],
  },
  {
    title: 'Customer care',
    links: [{ label: 'Help center' }, { label: 'Track order' }, { label: 'Returns' }, { label: 'Contact us' }],
  },
  {
    title: 'Sell with Halo',
    links: [{ label: 'Open a shop' }, { label: 'Seller center' }, { label: 'Affiliate program' }, { label: 'Policies' }],
  },
]
