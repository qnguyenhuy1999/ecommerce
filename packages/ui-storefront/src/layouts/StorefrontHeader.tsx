import * as React from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@ecom/ui";
import { Button } from "@ecom/ui";
import { Badge } from "@ecom/ui";

interface StorefrontHeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  logo?: React.ReactNode;
  className?: string;
}

const NAV_LINKS = [
  { label: "Shop", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

const StorefrontHeader = React.forwardRef<HTMLDivElement, StorefrontHeaderProps>(
  ({ cartCount = 0, onCartClick, logo, className }, ref) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
          className
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo ?? (
              <span className="text-xl font-bold tracking-tight">Storefront</span>
            )}
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Cart button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Shopping cart with ${cartCount} items`}
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge
                variant="default"
                className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] flex items-center justify-center rounded-full p-0 text-xs"
              >
                {cartCount > 99 ? "99+" : cartCount}
              </Badge>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden border-t py-4 flex flex-col gap-3"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    );
  }
);
StorefrontHeader.displayName = "StorefrontHeader";

export { StorefrontHeader };
export type { StorefrontHeaderProps };