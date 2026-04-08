'use client';

import { ThemeProvider } from '@ecom/ui/providers/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
