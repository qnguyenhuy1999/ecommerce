export const bannerStatuses = ['DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED'] as const
export type BannerStatus = (typeof bannerStatuses)[number]

export const bannerPositions = [
  'HERO',
  'HOMEPAGE_TOP',
  'HOMEPAGE_MIDDLE',
  'CAMPAIGN',
  'ANNOUNCEMENT',
] as const
export type BannerPosition = (typeof bannerPositions)[number]

export interface BannerRecord {
  id: string
  title: string
  position: BannerPosition
  status: BannerStatus
  imageUrl: string
  linkUrl: string | null
  dateRangeLabel: string
  sortOrder: number
}

export interface BannersProps {
  title?: string
  description?: string
  newBannerLabel?: string
  editLabel?: string
  deleteLabel?: string
  emptyMessage?: string
  items?: BannerRecord[]
  onNew?: () => void
  onEdit?: (item: BannerRecord) => void
  onDelete?: (item: BannerRecord) => void
}

export interface NewBannerButtonProps {
  label?: string | undefined
  onNew: () => void
}

export interface BannerActionsProps {
  item: BannerRecord
  editLabel?: string | undefined
  deleteLabel?: string | undefined
  onEdit?: ((item: BannerRecord) => void) | undefined
  onDelete?: ((item: BannerRecord) => void) | undefined
}

export interface BannersListProps {
  items: BannerRecord[]
  editLabel?: string | undefined
  deleteLabel?: string | undefined
  onEdit?: ((item: BannerRecord) => void) | undefined
  onDelete?: ((item: BannerRecord) => void) | undefined
}
