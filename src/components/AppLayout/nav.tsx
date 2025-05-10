'use client';
import { Home, Users, MessageSquare, User } from 'lucide-react';
import { useUser } from '@/hooks/profileIdContext';
import {  useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'; // Import framer-motion
import { supabase } from '@/utils/supabase/supabase';

const Navbar = () => {
  const { profileId } = useUser();
  const [unread, setUnread] = useState< number >(0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (href: string) => {
    setLoading(true);
    router.push(href);
  };
 
  useEffect(()=>{
  const fetchunreadCount = async()=>{
    try {
    if(profileId){
       const { count,error} = await supabase
    .from('messages')
    .select('id',{ count: 'exact', head: true})
    .eq('receiver_id', profileId)
    .eq('is_read', false);

    if(error){
      console.error("Error in fetching unread count nav page:", error.message);
    }
    setUnread(count || 0);
    }
   

  } catch (error) {
    console.error('Unexpected Error in fetching notification count:',error);
    
  }}

  fetchunreadCount();

},[profileId])
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
           <div className='relative w-10 h-10 flex items-center justify-center'>
          <button onClick={() => handleClick('/message')} className="active:bg-slate-200 active:text-black px-4 py-4 rounded-lg">
            <MessageSquare className="w-6 h-6  cursor-pointer"/>
             {unread >0 && (
            <span className='absolute top-0 right-0 w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
            
            </span>
          )}
          </button>
          </div>
          <button onClick={() => handleClick(`/profile/${profileId}`)} className="active:bg-slate-200 active:text-black px-4 py-4 rounded-lg">
            <User />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
