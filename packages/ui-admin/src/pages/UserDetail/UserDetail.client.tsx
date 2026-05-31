'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { StatusBadge } from '@ecom/core-ui/organisms/DataTable'
import type { UserDetailRecord } from './UserDetail.types'

interface UserDetailActionsProps {
  user: UserDetailRecord
  suspendLabel: string | undefined
  banLabel: string | undefined
  activateLabel: string | undefined
  onSuspend: (() => void | Promise<void>) | undefined
  onBan: (() => void | Promise<void>) | undefined
  onActivate: (() => void | Promise<void>) | undefined
}

export function UserDetailActions({
  user,
  suspendLabel,
  banLabel,
  activateLabel,
  onSuspend,
  onBan,
  onActivate,
}: UserDetailActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={user.status} />
      {user.canSuspend && (
        <Button type="button" variant="outline" size="sm" onClick={() => void onSuspend?.()}>
          {suspendLabel}
        </Button>
      )}
      {user.canBan && (
        <Button type="button" variant="destructive" size="sm" onClick={() => void onBan?.()}>
          {banLabel}
        </Button>
      )}
      {user.canActivate && (
        <Button type="button" variant="default" size="sm" onClick={() => void onActivate?.()}>
          {activateLabel}
        </Button>
      )}
    </div>
  )
}
