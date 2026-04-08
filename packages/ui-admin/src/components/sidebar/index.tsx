"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface SidebarNavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  onClick?: () => void;
}

interface SidebarNavGroup {
  label?: string;
  items: SidebarNavItem[];
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  navGroups?: SidebarNavGroup[];
  footer?: React.ReactNode;
}

function Sidebar({ logo, navGroups = [], footer, className, ...props }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 h-screen flex flex-col border-r bg-background shrink-0",
        className
      )}
      {...props}
    >
      {logo && (
        <div className="h-14 px-4 flex items-center border-b shrink-0">{logo}</div>
      )}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-2 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href || "#"}
                    onClick={item.onClick}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium text-foreground transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    {item.icon && (
                      <span className="w-4 h-4 shrink-0 [&>svg]:w-4 [&>svg]:h-4">{item.icon}</span>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {footer && (
        <div className="p-3 border-t shrink-0">{footer}</div>
      )}
    </aside>
  );
}

export { Sidebar };
export type { SidebarProps, SidebarNavGroup, SidebarNavItem };
