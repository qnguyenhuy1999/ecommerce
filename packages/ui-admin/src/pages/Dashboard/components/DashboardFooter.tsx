import { Activity } from 'lucide-react'

export function DashboardFooter() {
  return (
    <footer className="text-muted-foreground flex items-center gap-2 text-sm">
      <Activity className="size-4" aria-hidden="true" />
      <span>Logged in as Ops Admin | 3 active admins | 24 orders today</span>
    </footer>
  )
}
