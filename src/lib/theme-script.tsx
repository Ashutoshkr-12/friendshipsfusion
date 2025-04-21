// lib/theme-script.tsx
'use client';

export function ThemeScript() {
  const script = `
    (function() {
      const theme = localStorage.getItem('theme') || 'dark';
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}