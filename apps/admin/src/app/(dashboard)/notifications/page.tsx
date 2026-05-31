import { headers } from 'next/headers'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core/constants'
import { getNotifications } from '@/features/notifications/api/notifications.api'
import { NotificationsPageClient } from './_components/NotificationsPage.client'

export default async function Notifications() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const response = await getNotifications({ page: 1, limit: PAGINATION_DEFAULTS.PAGE_SIZE }, init)

  return <NotificationsPageClient initialData={response.data} />
}
