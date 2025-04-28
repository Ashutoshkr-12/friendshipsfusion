'use server'
import { createClient } from '@/utils/supabase/server';
//import { supabase } from '@/utils/supabase/supabase';


 const userdata=async()=> {
 const supabase = await createClient();
  try {
    const { data , error } = await supabase.auth.getUser();
    //console.log('Supabase session data:',data); // Log the session data

   
    if (error) {
      console.error('Error fetching session:', error);
      return null; // Return null if no session is found
    }
    const users = data.user
   //console.log(users);

   const { data: profileid , error: idError} = await supabase
   .from('profiles')
   .select('id')
   .eq('user_id',users.id)
   .single();

   //console.log(profileid)
   if(idError){
    console.error('Error in Fetching ID in userdata',idError)
    return null;
   }
   const profileId = profileid?.id || null;
   

    return {
      profileId,
      email: users?.email,
      userId: users?.id, // Access the `id` from the session user object
    };
   
  } catch (err) {
    console.error('Unexpected error in userdata:', err);
    return null; // Return null on unexpected errors
  }
}

export {userdata};