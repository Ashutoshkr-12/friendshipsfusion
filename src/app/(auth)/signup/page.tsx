// components/ProfileFormWrapper.tsx
'use client';

import { Suspense } from 'react';
import ProfileForm from '@/components/UserAuth/Signup'; // renamed original file

export default function ProfileFormWrapper() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><span className="loader" /></div>}>
      <ProfileForm />
    </Suspense>
  );
}
