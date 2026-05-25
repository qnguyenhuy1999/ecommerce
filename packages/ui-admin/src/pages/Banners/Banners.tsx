import { Typography } from '@ecom/core-ui'
import { SellerListPage } from '../../organisms'
import { bannersDefaultProps } from './Banners.fixtures'
import type { BannersProps } from './Banners.types'

export function Banners({
  title = bannersDefaultProps.title,
  description = bannersDefaultProps.description,
  newBannerLabel = bannersDefaultProps.newBannerLabel,
  editLabel = bannersDefaultProps.editLabel,
  deleteLabel = bannersDefaultProps.deleteLabel,
  emptyMessage = bannersDefaultProps.emptyMessage,
  items = bannersDefaultProps.items,
  onNew = bannersDefaultProps.onNew,
  onEdit = bannersDefaultProps.onEdit,
  onDelete = bannersDefaultProps.onDelete,
}: BannersProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Banners' }]}
      mainClassName="space-y-5"
    >
      <div className="flex items-center justify-between">
        <Typography variant="muted">
          {emptyMessage ?? 'No banners match current filters.'}
        </Typography>
        {onNew && (
          <button
            onClick={onNew}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
          >
            {newBannerLabel ?? '+ New banner'}
          </button>
        )}
      </div>

      {(items ?? []).length === 0 ? (
        <Typography variant="muted" className="py-12 text-center">
          {emptyMessage ?? 'No banners match current filters.'}
        </Typography>
      ) : (
        <div className="divide-y rounded-xl border">
          {(items ?? []).map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-4 py-3">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-12 w-20 rounded object-cover"
                />
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
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="hover:bg-muted rounded px-2 py-1 text-xs"
                  >
                    {editLabel ?? 'Edit'}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="text-destructive hover:bg-destructive/10 rounded px-2 py-1 text-xs"
                  >
                    {deleteLabel ?? 'Delete'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerListPage>
  )
}
