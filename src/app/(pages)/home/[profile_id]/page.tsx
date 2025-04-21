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
  const [userid, setUserid] = useState<string | undefined>();
  const params = useParams();

  useEffect(() => {
    // Set the userId from search parameters
    const userId = params.profile_id as string;
   // const userId = router.query.Id;
    setUserid(userId as string || undefined);
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
    if (!userid) {
      console.error('User ID is not set.');
      return;
    }

    // inserting like
    const { error: likeError } = await supabase
      .from('likes')
      .upsert(
        {
        liker_id: userid, // Use the userId from search parameters
        liked_id: profile.id,
        created_at: new Date().toISOString(),
      },
  );

    if (likeError) {
      console.error( 'Profile liking error', likeError );
      // Handle error (e.g., show a message to the user)
      return;
    }

    // send like notification to the user
    const {error: notifyError } = await supabase
    .from('notifications')
    .insert({
      user_id: profile.id, //other user
      type:'like',
      from_user_id: userid,  //me
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
          <div>
            <Link href={`/notifications/${userid}`}>
            <Bell size={30} className="mr-4 cursor-pointer"></Bell>
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