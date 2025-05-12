'use client'
import { useEffect, useState } from 'react';
import SwipeDeck from '@/components/dating/swipeDesh';
import AppLayout from '@/components/AppLayout/applayout';
import { profiles } from '@/lib/types';
import { toast } from 'sonner';
import { Heart, Bell } from 'lucide-react';
import { supabase } from '@/utils/supabase/supabase';
import { useParams } from 'next/navigation';
import { RouteLoader } from '@/components/ui/routerLoader';

const Index = () => {
  const [profile, setProfiles] = useState<profiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState< number >(0);
//  const [ message, setMessage] = useState('');
  const [profile_Id, setProfileid] = useState<string | undefined>();
  const params = useParams();


  // Set the userId from search parameters
  useEffect(() => {
    const userId = params.profile_id as string;
   // const userId = router.query.Id;
   setProfileid(userId as string || undefined);
    //console.log('User ID:', userId);
  }, [params]);


  // Fetch users profiles
  useEffect(() => {
    const loadProfiles = async() => {
      const res = await fetch(`/api/datingprofile?profile_Id=${params.profile_id}`,{
        headers: {
          'Content-type' : 'application/json'
        },
      });

      if(!res.ok){
        const errorData = await res.json();
        console.error("API error:",errorData);
        return;
      }
      
      // Data from serverAction
      const data = await res.json();
      if (data.profiles) {
        setProfiles(data.profiles);

      }
      setLoading(false);
    }
    loadProfiles();
  }, []);

  //fetch unread Notification
useEffect(()=>{
  const fetchunreadCount = async()=>{
  try {
    const { count,error} = await supabase
    .from('notifications')
    .select('id',{ count: 'exact', head: true})
    .eq('user_id', params.profile_id)
    .eq('is_read', false);

    if(error){
      console.error("Error in fetching unread count:", error.message);
    }
    setUnread(count || 0);

  } catch (error) {
    console.error('Unexpected Error in fetching notification count:',error);
    
  }}
  fetchunreadCount();

},[params])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }


  const handleSwipeLeft = (rejectedProfile: profiles) => {
    console.log('Rejected:', rejectedProfile.name);
    setProfiles(prev => prev.filter(p => p.id !== rejectedProfile.id));
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
      console.error('Error sending notification:', notifyError);
    }
    if(notifyError?.code === '23505'){
      toast('Profile already liked!!!')
    }else{
      if (2>0) {
        setTimeout(() => {
          toast.custom(() => (
            <div className="flex  items-center gap-3 bg-black px-2 py-1 rounded-lg">
              <div className="flex items-center gap-2">
                <Heart className="text-pink-500 fill-pink-500" size={18} />
              </div>
              <p>
              You reached out! Fingers crossed 🤞
              </p>
            </div>
          ));
        }, 100);
      }
       // Remove liked profile from the list
      setProfiles(prev => prev.filter(p => p.id !== profile.id));
    };
    }
    
    // Simulate a match 50% of the time
   
   

 
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl overflow-hidden">
        <div className="flex justify-between border-b">
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
            Find Your Match
          </h1>
          <div className='relative w-10 h-10 flex items-center justify-center'>
           <RouteLoader href ={`/notifications/${profile_Id}`} >
            <Bell size={30} className="w-6 h-6 text-gray-700 cursor-pointer"/>
          {unread >0 && (
            <span className='absolute top-0 right-0 w-5 h-5 inline-flex items-center justify-center px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
             {unread}
            </span>
          )}
         </RouteLoader>
          </div>

        </div>
{profile.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold mb-4">No profiles to show!</h2>
          <p className="text-gray-500 mb-4">Check back later for more matches</p>
        </div>
      ) : (
        <SwipeDeck
          profile={profile}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )
    }
        
      </div>
    </AppLayout>
  );
};

export default Index;