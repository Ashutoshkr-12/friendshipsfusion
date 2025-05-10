'use client'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

export function RouteLoader({ href, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    setLoading(true);
    router.push(href);
  };

  return (
    <>
      {loading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md z-50"
        />
      )}
      <div onClick={onClick}>
        {children}
      </div>
    </>
  );
}
