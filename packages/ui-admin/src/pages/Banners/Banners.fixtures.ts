import type { BannersProps } from './Banners.types'

export const bannersDefaultProps: BannersProps = {
  title: 'Banners',
  description: '4 banners · platform-wide',
  newBannerLabel: 'New banner',
  editLabel: 'Edit',
  deleteLabel: 'Delete',
  emptyMessage: 'No banners match current filters.',
  items: [
    {
      id: 'banner-1',
      title: 'Summer Sale 2026',
      position: 'HERO',
      status: 'ACTIVE',
      imageUrl:
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/sale/summer-2026',
      dateRangeLabel: 'Jun 1 – Jun 30, 2026',
      sortOrder: 1,
    },
    {
      id: 'banner-2',
      title: 'New Arrivals — Electronics',
      position: 'HOMEPAGE_TOP',
      status: 'SCHEDULED',
      imageUrl:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      linkUrl: '/category/electronics',
      dateRangeLabel: 'Jul 1 – Jul 15, 2026',
      sortOrder: 2,
    },
    {
      id: 'banner-3',
      title: 'Flash Deals Weekend',
      position: 'CAMPAIGN',
      status: 'DRAFT',
      imageUrl:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      linkUrl: null,
      dateRangeLabel: '—',
      sortOrder: 3,
    },
    {
      id: 'banner-4',
      title: 'Platform Maintenance Notice',
      position: 'ANNOUNCEMENT',
      status: 'EXPIRED',
      imageUrl: '',
      linkUrl: null,
      dateRangeLabel: 'May 1 – May 10, 2026',
      sortOrder: 4,
    },
  ],
}
