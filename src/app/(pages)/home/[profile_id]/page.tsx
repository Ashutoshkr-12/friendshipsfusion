'use client'
import { useEffect, useState } from 'react';
import SwipeDeck from '@/components/dating/swipeDesh';
import AppLayout from '@/components/AppLayout/applayout';
import { profiles } from '@/lib/types';
import { toast } from 'sonner';
import { Heart, Bell } from 'lucide-react';
import { supabase } from '@/utils/supabase/supabase';
import { fetchedProfiles } from '@/serverActions/datingProfiles';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const Index = () => {
  const [profile, setProfiles] = useState<profiles[]>([]);
  const [loading, setLoading] = useState(true);
//  const [ message, setMessage] = useState('');
  const [profile_Id, setProfileid] = useState<string | undefined>();
  const params = useParams();

  useEffect(() => {
    // Set the userId from search parameters
    const userId = params.profile_id as string;
   // const userId = router.query.Id;
   setProfileid(userId as string || undefined);
    //console.log('User ID:', userId);
  }, [params]);


  // Fetch users profiles

  useEffect(() => {
    async function loadProfiles() {
      const data: profiles[] = await fetchedProfiles();  // Data from serverAction
      setProfiles(data);
      setLoading(false);
    }
    loadProfiles();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  const handleSwipeLeft = (profile: profiles) => {
    console.log('Rejected:', profile.name);
  };

  const handleSwipeRight = async (profile: profiles) => {

// getting current user id.....    
    if (!profile_Id) {
      console.error('User ID is not set.');
      return;
    }

    // inserting like
    const { error: likeError } = await supabase
      .from('likes')
      .upsert(
        {
        liker_id: profile_Id, // Use the userId from search parameters
        liked_id: profile.id,
        created_at: new Date().toISOString(),
      },
  );

    if (likeError?.code === '22P02') {
    toast( 'Profile already liked' );
      // Handle error (e.g., show a message to the user)
      return;
    }

    // send like notification to the user
    const {error: notifyError } = await supabase
    .from('notifications')
    .insert({
      user_id: profile.id, //other user
      type:'like',
      from_user_id: profile_Id,  //me
      created_at: new Date().toISOString(),
    }); 


    if(notifyError){
      console.error('Error sending notification:', notifyError.message);
    }

    
    // Simulate a match 50% of the time
    if (Math.random() > 0.1) {
      setTimeout(() => {
        toast.custom(() => (
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Heart className="text-pink-500 fill-pink-500" size={18} />
            </div>
            <p>
              Matching request has been sent to {profile.name}. Now wait for {profile.name} to like
              you back!
            </p>
          </div>
        ));
      }, 100);
    }
  };

 
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl overflow-hidden">
        <div className="flex justify-between border-b">
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
            Find Your Match
          </h1>
          <div className='relative bg-green-500 w-10 h-10 flex items-center p-1 '>
            <Link href={`/notifications/${profile_Id}`}>
            <Bell size={30} className="mr-4 cursor-pointer"/>
           <span className='absolute  h-4 w-4 rounded-full  text-red-600 bg-red-600'></span>
          </Link> 
          </div>

        </div>

        <SwipeDeck
          profile={profile}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>
    </AppLayout>
  );
};

export default Index;