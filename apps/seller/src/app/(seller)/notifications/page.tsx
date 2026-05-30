import { headers } from 'next/headers'
import { getNotifications } from '@/features/notifications/api'
import { mapNotificationsToRows } from '@/features/notifications/mappers'
import { NotificationsPageClient } from './_components/NotificationsPage.client'

export default async function NotificationsPage() {
  const cookie = (await headers()).get('cookie')
  const init = { cache: 'no-store' as const, ...(cookie ? { headers: { cookie } } : {}) }
  const items = await getNotifications(undefined, init)
  const initialData = mapNotificationsToRows(items)
  return <NotificationsPageClient initialData={initialData} />
}
