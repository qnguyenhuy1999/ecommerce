import { Button, Card, Typography } from '@ecom/core-ui'
import { TicketPercent } from 'lucide-react'

export interface VoucherCardProps {
  title: string
  minimum: string
  code: string
}

export function VoucherCard({ title, minimum, code }: VoucherCardProps) {
  return (
    <Card className="min-w-72 flex-row gap-0 py-0">
      <div className="bg-primary text-primary-foreground flex w-24 shrink-0 flex-col items-center justify-center gap-2 p-4">
        <TicketPercent className="size-5" />
        <Typography variant="caption" className="font-semibold">
          VOUCHER
        </Typography>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4">
        <div>
          <Typography variant="label" className="font-semibold">
            {title}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            {minimum}
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            CODE · {code}
          </Typography>
        </div>
        <Button size="sm">Claim</Button>
      </div>
    </Card>
  )
}
