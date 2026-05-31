'use client'

import { LogOut } from 'lucide-react'

interface ConsoleLogoutButtonProps {
  onLogout: () => void | Promise<void>
}

export function ConsoleLogoutButton({ onLogout }: ConsoleLogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        void onLogout()
      }}
      className="hover:bg-muted hover:text-foreground text-muted-foreground flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
    >
      <LogOut className="size-4 shrink-0" />
      Logout
    </button>
  )
}
