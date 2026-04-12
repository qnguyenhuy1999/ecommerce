import * as React from 'react'
import { cn } from '@ecom/ui'
import { NewsletterSignup } from '../../organisms/newsletter-signup'
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

export interface StorefrontFooterProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode
  description?: string
  showNewsletter?: boolean
  columns?: {
    title: string
    links: { label: string; href: string }[]
  }[]
  socials?: { platform: 'instagram' | 'twitter' | 'facebook' | 'youtube'; href: string }[]
  copyright?: string
}

function StorefrontFooter({ 
  logo, 
  description, 
  showNewsletter = true, 
  columns = [], 
  socials = [], 
  copyright = `© ${new Date().getFullYear()} Ecommerce Inc. All rights reserved.`, 
  className, 
  ...props 
}: StorefrontFooterProps) {
  
  const socialIcons = {
    instagram: <Instagram className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />
  }

  return (
    <footer className={cn("bg-surface-secondary border-t pt-16 pb-8", className)} {...props}>
      {showNewsletter && (
        <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 md:px-8 mb-16 border-b border-border/50 pb-16">
          <NewsletterSignup />
        </div>
      )}

      <div className="max-w-[var(--storefront-content-max-width)] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
           {/* Brand Column */}
           <div className="lg:col-span-2">
             {logo && <div className="mb-6">{logo}</div>}
             {description && (
               <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                 {description}
               </p>
             )}
             {socials.length > 0 && (
               <div className="flex items-center gap-4">
                 {socials.map((social, i) => (
                   <a 
                     key={i} 
                     href={social.href} 
                     target="_blank" 
                     rel="noreferrer"
                     className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted shadow-sm transition-all"
                   >
                     {socialIcons[social.platform]}
                   </a>
                 ))}
               </div>
             )}
           </div>

           {/* Link Columns */}
           {columns.map((col, i) => (
             <div key={i}>
               <h3 className="font-semibold mb-5 text-foreground">{col.title}</h3>
               <ul className="space-y-3.5">
                 {col.links.map((link, j) => (
                   <li key={j}>
                     <a 
                       href={link.href} 
                       className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-all"
                     >
                       {link.label}
                     </a>
                   </li>
                 ))}
               </ul>
             </div>
           ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4 text-sm text-muted-foreground">
          <p>{copyright}</p>
          
          <div className="flex items-center gap-4">
            {/* Payment Method Placeholders */}
            <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div className="w-10 h-6 bg-muted rounded-[4px] border flex items-center justify-center text-[8px] font-bold">VISA</div>
              <div className="w-10 h-6 bg-muted rounded-[4px] border flex items-center justify-center text-[8px] font-bold">MC</div>
              <div className="w-10 h-6 bg-muted rounded-[4px] border flex items-center justify-center text-[8px] font-bold">AMEX</div>
              <div className="w-10 h-6 bg-muted rounded-[4px] border flex items-center justify-center text-[8px] font-bold">PAYPAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StorefrontFooter }
