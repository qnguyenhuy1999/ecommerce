import * as React from "react";
import { cn } from "@ecom/ui";

interface StorefrontShellProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const StorefrontShell = React.forwardRef<HTMLDivElement, StorefrontShellProps>(
  ({ header, footer, children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col min-h-screen bg-background text-foreground",
          className
        )}
      >
        {header && <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">{header}</header>}
        <main className="flex-1">
          {children}
        </main>
        {footer && <footer className="border-t bg-background">{footer}</footer>}
      </div>
    );
  }
);
StorefrontShell.displayName = "StorefrontShell";

export { StorefrontShell };
export type { StorefrontShellProps };