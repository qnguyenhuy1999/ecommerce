'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Plus, Send } from 'lucide-react'
import { SellerListPage } from '../../organisms'
import type { NotificationRecord, NotificationsProps } from './Notifications.types'

interface NotificationsClientProps {
  newLabel: string
  sendLabel: string
  emptyMessage: string
  items: NotificationRecord[]
  onNew?: NotificationsProps['onNew']
  onSend?: NotificationsProps['onSend']
}

export function NotificationsClient({
  newLabel,
  sendLabel,
  emptyMessage,
  items,
  onNew,
  onSend,
}: NotificationsClientProps) {
  return (
    <SellerListPage.Header>
      <div className="flex items-center justify-end">
        <SellerListPage.Actions>
          <Button type="button" onClick={onNew}>
            <Plus className="size-4" />
            {newLabel}
          </Button>
        </SellerListPage.Actions>
      </div>

      <SellerListPage.Table
        columns={[
          {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }: { row: { original: NotificationRecord } }) => (
              <span className="font-medium">{row.original.title}</span>
            ),
          },
          { accessorKey: 'channel', header: 'Channel' },
          { accessorKey: 'status', header: 'Status' },
          {
            accessorKey: 'targetAll',
            header: 'Target',
            cell: ({ row }: { row: { original: NotificationRecord } }) =>
              row.original.targetAll ? 'All Users' : 'Selected',
          },
          { accessorKey: 'sentAtLabel', header: 'Sent' },
          { accessorKey: 'createdAtLabel', header: 'Created' },
          {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: { original: NotificationRecord } }) => {
              if (row.original.status !== 'DRAFT') return null
              return (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSend?.(row.original)}
                >
                  <Send className="size-3" />
                  {sendLabel}
                </Button>
              )
            },
          },
        ]}
        data={items}
        emptyMessage={emptyMessage}
      />
    </SellerListPage.Header>
  )
}
