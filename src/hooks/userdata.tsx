'use server'
import { getUsersession } from '@/serverActions/authAction';
import { supabase } from '@/utils/supabase/supabase';

 const userdata=async()=> {
  try {
    const data = await getUsersession();
    //console.log('Supabase session data:',data); // Log the session data
   
    // if (error) {
    //   console.error('Error fetching session:', error);
    //   return null; // Return null if no session is found
    // }
    const users = data?.user
     //console.log(users);

     const { data: profile, error} = await supabase
     .from('profiles')
     .select('id')
     .eq('user_id',users?.id)

     if(error){
      console.error('Error in profile id Fetching')
     }

     console.log(profile)
    return {
      profileId: profile,
    email: users?.email,
    userId: users?.id // Access the `id` from the session user object
    };
   
  } catch (err) {
    console.error('Unexpected error in userdata:', err);
    return null; // Return null on unexpected errors
  }
}

export {userdata};