import { userdata } from "@/hooks/userdata";
import { supabase } from "@/utils/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(){

    const user = await userdata();
    const profileId = user?.profileId;
    console.log(profileId)
    const { data, error} = await supabase
    .from('profiles')
    .select('*')
    //.neq('id',profileId);

    if(error){
        return NextResponse.json({ error: error.message}, {status: 500})
    }
    return NextResponse.json({ profiles: data}, { status:200})
}