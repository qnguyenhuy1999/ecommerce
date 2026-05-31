import type { CampaignItem, DisputeQueueItem } from './Dashboard.types'

export const dashboardCardClassName = 'rounded-3xl border-border/80 shadow-sm'
export const dashboardActionClassName = 'text-primary'
export const warningBadgeClassName = 'bg-warning/12 text-warning rounded-full'

export function getDisputeToneClassNames(tone: DisputeQueueItem['tone']) {
  switch (tone) {
    case 'info':
      return {
        dot: 'text-info',
        badge: 'border-info/20 bg-info/10 text-info',
      }
    case 'warning':
      return {
        dot: 'text-warning',
        badge: 'border-warning/25 bg-warning/12 text-warning',
      }
    case 'destructive':
      return {
        dot: 'text-destructive',
        badge: 'border-destructive/20 bg-destructive/10 text-destructive',
      }
    case 'success':
      return {
        dot: 'text-success',
        badge: 'border-success/20 bg-success/10 text-success',
      }
    case 'muted':
      return {
        dot: 'text-muted-foreground',
        badge: 'border-border bg-muted text-muted-foreground',
      }
  }
}

export function getCampaignToneClassName(tone: CampaignItem['tone']) {
  return tone === 'success'
    ? 'bg-success/10 text-success rounded-full'
    : 'bg-info/10 text-info rounded-full'
}
