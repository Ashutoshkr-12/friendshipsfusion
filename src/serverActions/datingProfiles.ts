import { supabase } from '@/utils/supabase/supabase';
import { profiles  } from '@/lib/types';
import { useUser } from '@/hooks/profileIdContext';


export const fetchedProfiles= async ():Promise<profiles[]>=>{
    
try {
   // const {profileId} = useUser();
   
        const { data, error} = await supabase
        .from('profiles')
        .select('*')
       // .neq('id', profileid);
    
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


