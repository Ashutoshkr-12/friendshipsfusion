'use client'
import AppLayout from "@/components/AppLayout/applayout"
import type { UserProfile as profiles } from "@/lib/types"
import { supabase } from "@/utils/supabase/supabase";
import { useEffect, useState } from "react";
import UserProfile from "@/components/userprofile/userProfile";
import { useParams } from "next/navigation";


function profile() {
  const [currentUserProfile, setCurrentUSerProfile] = useState<profiles>();
 const params= useParams();
  

  useEffect(()=>{
    const fetchUserProfile= async ()=>{
      const userid= params.profile_id as string;
  // console.log(userid)
      const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id',userid)
      .single();

      if(error){
        console.error('Error in fetching current user profile',error.message)
      }
      setCurrentUSerProfile(data);
     // console.log(data);
  }
  //console.log(currentUserProfile);
fetchUserProfile()
},[params])
  return (
    <AppLayout>
      {currentUserProfile && <UserProfile userProfile={currentUserProfile} />}
    </AppLayout>
  )
}

export default profile;