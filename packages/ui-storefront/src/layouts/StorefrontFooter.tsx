import * as React from "react";
import { cn } from "@ecom/ui";

interface StorefrontFooterProps {
  className?: string;
}

const FooterLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Shipping", href: "#" },
  { label: "Returns", href: "#" },
];

const SocialLinks = [
  { label: "Twitter", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];

const StorefrontFooter = React.forwardRef<HTMLDivElement, StorefrontFooterProps>(
  ({ className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Storefront. All rights reserved.
          </p>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4">
            {FooterLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Social links" className="flex items-center gap-4">
            {SocialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  }
);
StorefrontFooter.displayName = "StorefrontFooter";

export { StorefrontFooter };
export type { StorefrontFooterProps };