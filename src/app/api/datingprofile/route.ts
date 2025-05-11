import { supabase } from "@/utils/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request){

 try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profile_Id')
       
       console.log(profileId)
       const { data, error} = await supabase
       .from('profiles')
       .select('*')
       .neq('id',profileId);
   
       if(error){
           return NextResponse.json({ error: error.message}, {status: 500})
       }
       return NextResponse.json({ profiles: data}, { status:200})

} catch {
  return NextResponse.json({ message: 'Error in fetching profiles' }, { status: 500 });
}
}