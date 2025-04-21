'use client'
import { useEffect,useState } from 'react';
import { Home, Users, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';
import { userdata } from '@/hooks/userdata';

const Navbar = () => {
  const [ profileID, setProfileID] = useState<string | null>();

 useEffect(()=>{
  const fetchprofileId = async ()=>{
      const id = await userdata();
      //console.log(id)
      const profileId = id?.profileId?.id; // Extract the 'id' property
      
      setProfileID(profileId);
  }
  fetchprofileId()
 },[])


  return (
    <nav className="fixed bottom-0 left-0 w-full  bg-background  border-t border-border p-2 md:p-0 md:top-0 md:left-0 md:h-full md:w-16 md:border-r md:border-t-0 z-10">
      <div className="flex flex-1/4 justify-around md:flex-col md:h-full md:pt-8 md:gap-8 items-center ">
        <Link href={`/home/${profileID}`} className='active:bg-slate-200 active:text-black px-4 py-4 rounded-lg'><Home/></Link>
        <Link href={'/rent-a-friend'} className='active:bg-slate-200 active:text-black px-4 py-4 rounded-lg'><Users/></Link>
        <Link href={'/message'} className='active:bg-slate-200 active:text-black px-4 py-4 rounded-lg'><MessageSquare/></Link>
        <Link href={`/profile/${profileID}`} className='active:bg-slate-200 active:text-black px-4 py-4 rounded-lg'><User/></Link>
      </div>
    </nav>
  );
};

export default Navbar;
