import { Typography } from '@ecom/core-ui/atoms/Typography'
import { ConsolePageLayout } from '@ecom/core-ui/layouts/ConsolePageLayout'
import { userDetailDefaultProps } from './UserDetail.fixtures'
import { UserDetailActions } from './UserDetail.client'
import type { UserDetailProps } from './UserDetail.types'

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />
      ))}
    </div>
  )
}

export function UserDetail({
  user = userDetailDefaultProps.user,
  loading = userDetailDefaultProps.loading,
  backHref = userDetailDefaultProps.backHref,
  suspendLabel = userDetailDefaultProps.suspendLabel,
  banLabel = userDetailDefaultProps.banLabel,
  activateLabel = userDetailDefaultProps.activateLabel,
  onSuspend = userDetailDefaultProps.onSuspend,
  onBan = userDetailDefaultProps.onBan,
  onActivate = userDetailDefaultProps.onActivate,
}: UserDetailProps) {
  if (loading) return <LoadingSkeleton />
  if (!user) return <Typography variant="muted">User not found.</Typography>

  return (
    <ConsolePageLayout
      title={user.email}
      description={user.name}
      breadcrumb={[
        { label: 'Admin', href: '#' },
        backHref ? { label: 'Buyers', href: backHref } : { label: 'Buyers' },
        { label: user.email },
      ]}
      actions={
        <UserDetailActions
          user={user}
          suspendLabel={suspendLabel}
          banLabel={banLabel}
          activateLabel={activateLabel}
          onSuspend={onSuspend}
          onBan={onBan}
          onActivate={onActivate}
        />
      }
      mainClassName="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <Typography variant="label" className="mb-4 block">
            Profile
          </Typography>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{user.phone ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Verified</dt>
              <dd>{user.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Joined</dt>
              <dd>{user.joinedAtLabel}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <Typography variant="label" className="mb-4 block">
            Sessions ({user.sessions.length})
          </Typography>
          {user.sessions.length > 0 ? (
            <div className="space-y-2">
              {user.sessions.map((session) => (
                <div key={session.id} className="rounded border p-2 text-xs">
                  <Typography variant="caption" className="block truncate">
                    {session.userAgent ?? 'Unknown device'}
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
                    {session.ipAddress ?? '—'} · {session.createdAtLabel}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <Typography variant="muted">No active sessions.</Typography>
          )}
        </div>
      </div>
    </ConsolePageLayout>
  )
}
