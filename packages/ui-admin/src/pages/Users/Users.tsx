import { SellerListPage } from '../../organisms'
import { usersDefaultProps } from './Users.fixtures'
import { UsersClient } from './Users.client'
import type { UsersProps } from './Users.types'

export function Users({
  title = usersDefaultProps.title,
  description = usersDefaultProps.description,
  searchPlaceholder = usersDefaultProps.searchPlaceholder,
  exportLabel = usersDefaultProps.exportLabel,
  inviteLabel = usersDefaultProps.inviteLabel,
  emptyStateMessage = usersDefaultProps.emptyStateMessage,
  roleOptions = usersDefaultProps.roleOptions,
  statusOptions = usersDefaultProps.statusOptions,
  joinedOptions = usersDefaultProps.joinedOptions,
  statusTabs = usersDefaultProps.statusTabs,
  items = usersDefaultProps.items,
  onExport = usersDefaultProps.onExport,
  onInvite = usersDefaultProps.onInvite,
}: UsersProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Users' }]}
      mainClassName="space-y-5"
    >
      <UsersClient
        searchPlaceholder={searchPlaceholder ?? 'Search name or email...'}
        exportLabel={exportLabel ?? 'Export CSV'}
        inviteLabel={inviteLabel ?? 'Invite admin'}
        emptyStateMessage={emptyStateMessage ?? 'No users match current filters.'}
        roleOptions={roleOptions ?? []}
        statusOptions={statusOptions ?? []}
        joinedOptions={joinedOptions ?? []}
        statusTabs={statusTabs ?? []}
        items={items ?? []}
        onExport={onExport}
        onInvite={onInvite}
      />
    </SellerListPage>
  )
}
