// components/theme-provider.tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark" // Set to dark as default
      enableSystem = {false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}