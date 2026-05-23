import type { SupportTicketStatus } from './Support.types'

export const SUPPORT_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  NEW: 'New',
  OPEN: 'Open',
  PENDING: 'Pending',
  SOLVED: 'Solved',
}

export const SUPPORT_STATUS_DOT_CLASSES: Record<SupportTicketStatus, string> = {
  NEW: 'bg-orange-500',
  OPEN: 'bg-red-500',
  PENDING: 'bg-amber-400',
  SOLVED: 'bg-gray-400',
}

export const SUPPORT_STATUS_BADGE_CLASSES: Record<SupportTicketStatus, string> = {
  NEW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  OPEN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  SOLVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export const SUPPORT_ALL_STATUSES: SupportTicketStatus[] = ['NEW', 'OPEN', 'PENDING', 'SOLVED']
