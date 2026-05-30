'use client'

import { Badge } from '@ecom/core-ui/atoms/Badge'
import { Switch } from '@ecom/core-ui/atoms/Switch'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent } from '@ecom/core-ui/molecules/Card'
import { PageHeader } from '../../atoms/PageHeader'
import { shippingDefaultProps } from './Shipping.fixtures'
import type { ShippingProps } from './Shipping.types'

export function ShippingClient({
  title = shippingDefaultProps.title,
  description = shippingDefaultProps.description,
  rows = shippingDefaultProps.rows,
  loading = shippingDefaultProps.loading,
  onToggle,
  emptyMessage = shippingDefaultProps.emptyMessage,
}: ShippingProps) {
  return (
    <div className="p-6">
      <PageHeader title={title} description={description} />

      {loading ? (
        <div className="text-muted-foreground py-12 text-center text-sm">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center text-sm">{emptyMessage}</div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <Card key={row.id} className="border-border bg-card">
              <CardContent className="flex items-center justify-between gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div>
                    <Typography variant="label" className="text-foreground">
                      {row.name}
                    </Typography>
                    <Badge variant="secondary" className="mt-1 rounded-full text-xs">
                      {row.code}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={row.isEnabled}
                  onCheckedChange={(checked) => onToggle?.(row.id, checked)}
                  aria-label={`Toggle ${row.name}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
