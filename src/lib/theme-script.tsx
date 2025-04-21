// lib/theme-script.tsx
// components/ThemeScript.tsx
'use client';

export function ThemeScript() {
  const script = `
    (function() {
      const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.add(theme);
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}