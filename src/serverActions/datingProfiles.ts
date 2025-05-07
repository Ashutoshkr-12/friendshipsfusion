import { supabase } from '@/utils/supabase/supabase';
import { profiles  } from '@/lib/types';


export const fetchedProfiles= async ():Promise<profiles[]>=>{
    
try {
  const profileId = localStorage.getItem('profileId')
  console.log(profileId)
   
        const { data, error} = await supabase
        .from('profiles')
        .select('*')
        .neq('id', profileId);
    
        if(error){
            throw error;
            return[];
        }
        return data as profiles[];
} catch (error) {
    console.log(error);
    return[];
}
}


