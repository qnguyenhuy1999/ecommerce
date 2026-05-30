import { Typography } from '@ecom/core-ui/atoms/Typography'
import {
  MediaUpload,
  type MediaItem,
  type MediaUploadProps,
} from '@ecom/core-ui/molecules/MediaUpload'
import { withDefined } from '@ecom/shared/utils/optional-object'
import { cn } from '@ecom/shared/utils/cn'

type ProductMediaUploadProps = Omit<MediaUploadProps, 'coverIndex'> & {
  className?: string
}

export function ProductMediaUpload({
  items,
  maxItems = 9,
  onAdd,
  onRemove,
  accept,
  className,
}: ProductMediaUploadProps) {
  return (
    <div className={cn('border-border bg-surface rounded-xl border p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <Typography variant="label" as="h3">
          Media
        </Typography>
        <Typography variant="muted" as="span" className="text-sm">
          {items.length} of {maxItems} images
        </Typography>
      </div>
      <MediaUpload
        items={items}
        maxItems={maxItems}
        {...withDefined({
          onAdd,
          onRemove,
          accept,
        })}
      />
    </div>
  )
}

export type { MediaItem }
