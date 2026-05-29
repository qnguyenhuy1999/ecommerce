import { formatDateIntl } from '@ecom/shared'
import type { BannerRecord, BannerStatus, BannerPosition } from '@ecom/ui-admin'
import type { BannerListItem } from '../api/banners.api'

function toBannerStatus(status: string): BannerStatus {
  const map: Record<string, BannerStatus> = {
    DRAFT: 'DRAFT',
    SCHEDULED: 'SCHEDULED',
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    ARCHIVED: 'EXPIRED',
  }
  return map[status] ?? 'DRAFT'
}

function toBannerPosition(position: string): BannerPosition {
  const map: Record<string, BannerPosition> = {
    HERO: 'HERO',
    HOMEPAGE_TOP: 'HOMEPAGE_TOP',
    HOMEPAGE_MIDDLE: 'HOMEPAGE_MIDDLE',
    CAMPAIGN: 'CAMPAIGN',
    ANNOUNCEMENT: 'ANNOUNCEMENT',
  }
  return map[position] ?? 'HERO'
}

function toDateRangeLabel(startsAt: string | null, endsAt: string | null): string {
  if (!startsAt && !endsAt) return '—'
  const fmt = (d: string) =>
    formatDateIntl(d, { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')
  if (startsAt && endsAt) return `${fmt(startsAt)} – ${fmt(endsAt)}`
  if (startsAt) return `From ${fmt(startsAt)}`
  if (endsAt) return `Until ${fmt(endsAt)}`
  return '—'
}

export function mapBannerToRecord(banner: BannerListItem): BannerRecord {
  return {
    id: banner.id,
    title: banner.title,
    position: toBannerPosition(banner.position),
    status: toBannerStatus(banner.status),
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
    dateRangeLabel: toDateRangeLabel(banner.startsAt, banner.endsAt),
    sortOrder: banner.sortOrder,
  } satisfies BannerRecord
}
