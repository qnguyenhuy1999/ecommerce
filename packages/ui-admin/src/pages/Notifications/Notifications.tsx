import { SellerListPage } from '../../organisms'
import { notificationsDefaultProps } from './Notifications.fixtures'
import { NotificationsClient } from './Notifications.client'
import type { NotificationsProps } from './Notifications.types'

export function Notifications({
  title = notificationsDefaultProps.title,
  description = notificationsDefaultProps.description,
  newLabel = notificationsDefaultProps.newLabel,
  sendLabel = notificationsDefaultProps.sendLabel,
  emptyMessage = notificationsDefaultProps.emptyMessage,
  items = notificationsDefaultProps.items,
  onNew = notificationsDefaultProps.onNew,
  onSend = notificationsDefaultProps.onSend,
}: NotificationsProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Notifications' }]}
      mainClassName="space-y-5"
    >
      <NotificationsClient
        newLabel={newLabel ?? 'New Notification'}
        sendLabel={sendLabel ?? 'Send'}
        emptyMessage={emptyMessage ?? 'No notifications found.'}
        items={items ?? []}
        onNew={onNew}
        onSend={onSend}
      />
    </SellerListPage>
  )
}
