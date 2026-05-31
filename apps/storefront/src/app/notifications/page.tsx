import { headers } from 'next/headers'
import { getNotifications } from '../../features/notifications/queries'
import { toNotificationState } from '../../features/notifications/mappers'
import { NotificationsPageClient } from './_components/NotificationsPage.client'

export default async function StorefrontNotificationsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const items = await getNotifications(init)

  return <NotificationsPageClient initialData={items.map(toNotificationState)} />
}
