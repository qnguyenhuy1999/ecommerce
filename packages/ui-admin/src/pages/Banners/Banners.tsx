import { Typography } from '@ecom/core-ui/atoms/Typography'
import { SellerListPage } from '../../organisms'
import { BannerActions, NewBannerButton } from './Banners.client'
import { bannersDefaultProps } from './Banners.fixtures'
import type { BannersListProps, BannersProps } from './Banners.types'

export function Banners({
  title = bannersDefaultProps.title,
  description = bannersDefaultProps.description,
  newBannerLabel = bannersDefaultProps.newBannerLabel,
  editLabel = bannersDefaultProps.editLabel,
  deleteLabel = bannersDefaultProps.deleteLabel,
  emptyMessage = bannersDefaultProps.emptyMessage,
  items = bannersDefaultProps.items,
  onNew,
  onEdit,
  onDelete,
}: BannersProps) {
  const banners = items ?? []
  const message = emptyMessage ?? 'No banners match current filters.'

  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Banners' }]}
      mainClassName="space-y-5"
    >
      <Banners.Header
        message={message}
        action={onNew ? <NewBannerButton label={newBannerLabel} onNew={onNew} /> : null}
      />

      {banners.length === 0 ? (
        <Banners.Empty message={message} />
      ) : (
        <Banners.List
          items={banners}
          editLabel={editLabel}
          deleteLabel={deleteLabel}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </SellerListPage>
  )
}

Banners.Header = function BannersHeader({
  message,
  action,
}: {
  message: string
  action: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="muted">{message}</Typography>
      {action}
    </div>
  )
}

Banners.Empty = function BannersEmpty({ message }: { message: string }) {
  return (
    <Typography variant="muted" className="py-12 text-center">
      {message}
    </Typography>
  )
}

Banners.List = function BannersList({
  items,
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
}: BannersListProps) {
  return (
    <div className="divide-y rounded-xl border">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 px-4 py-3">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="h-12 w-20 rounded object-cover" />
          ) : (
            <div className="bg-muted h-12 w-20 rounded" />
          )}

          <div className="min-w-0 flex-1">
            <Typography variant="body-sm" className="truncate font-medium">
              {item.title}
            </Typography>

            <Typography variant="caption" className="text-muted-foreground">
              {item.position} · {item.dateRangeLabel}
            </Typography>
          </div>

          <span className="text-xs font-medium uppercase">{item.status}</span>

          <span className="text-muted-foreground text-xs">#{item.sortOrder}</span>

          <BannerActions
            item={item}
            editLabel={editLabel}
            deleteLabel={deleteLabel}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  )
}
