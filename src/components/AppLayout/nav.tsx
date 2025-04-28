'use client';
import { Home, Users, MessageSquare, User } from 'lucide-react';
import { useUser } from '@/hooks/profileIdContext';
import {  useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'; // Import framer-motion

const Navbar = () => {
  const { profileId } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (href: string) => {
    setLoading(true);
    router.push(href);
  };

  return (
    <>
      {/* Animated Loading Bar */}
      {loading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md z-50"
        />
      )}

      <nav className="fixed bottom-0 left-0 w-full bg-background border-t border-border p-2 md:p-0 md:top-0 md:left-0 md:h-full md:w-16 md:border-r md:border-t-0 z-10">
        <div className="flex flex-1/4 justify-around md:flex-col md:h-full md:pt-8 md:gap-8 items-center">
          <button onClick={() => handleClick(`/home/${profileId}`)} className="active:bg-slate-200 active:text-black px-4 py-4 rounded-lg">
            <Home />
          </button>
          <button onClick={() => handleClick('/rent-a-friend')} className="active:bg-slate-200 active:text-black px-4 py-4 rounded-lg">
            <Users />
          </button>
          <button onClick={() => handleClick('/message')} className="active:bg-slate-200 active:text-black px-4 py-4 rounded-lg">
            <MessageSquare />
          </button>
          <button onClick={() => handleClick(`/profile/${profileId}`)} className="active:bg-slate-200 active:text-black px-4 py-4 rounded-lg">
            <User />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
