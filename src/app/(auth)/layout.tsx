'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/hooks/profileIdContext';


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { profileId} = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (profileId && (pathname === '/login' || pathname === '/signup' || pathname === '/forget-password')) {
      router.push(`/home/${profileId}`);
    }
  }, [profileId, pathname, router]);

  return (
        <main>{children}</main>
    
  );
}