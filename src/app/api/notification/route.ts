import { supabase } from "@/utils/supabase/supabase";
import { NextResponse } from "next/server";


export async function GET(request: Request){
    try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profile_id');
        // const { data: user, error: sessionError} = await supabase.auth.getUser();
        // if(sessionError){
        //     return NextResponse.json({error: 'Unauthorized' }, { status: 401});
        // }
        // const userId = user.user.id;

        // const { data: profile, error: profileError} = await supabase
        // .from('profiles')
        // .select('id')
        // .eq('user_id',userId)
        // .single();

        // if(profileError || !profile){
        //     return NextResponse.json({ error: 'Profile not found'}, { status: 404});
        // }

        const { data,error} = await supabase
        .from('notifications')
        .select(`
            id,
            type,
            from_user_id,
            is_read,
            created_at,
            profiles:from_user_id (name, avatar)`)
        .eq('user_id',profileId)
        .order('created_at', { ascending: false});

        if(error){
            console.error('Fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch notification'}, { status: 500});
        }

        return NextResponse.json(data, { status: 200});
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Server error:'}, { status: 500});
    }
}