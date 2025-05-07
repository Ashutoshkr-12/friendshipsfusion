import { supabase } from "@/utils/supabase/supabase";
import { NextResponse } from "next/server";


export async function GET(request: Request){
    try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profile_id');

        const { data,error} = await supabase
        .from('booking_request')
        .select(`
            id,
            created_at,
            rentalprofile_id,
            user_id,
            services,
            when,
            duration,
            message,
            status,
            profiles: user_id(name,avatar)
            `)
        .eq(' rentalprofile_id',profileId)
        .order('created_at', { ascending: false});

        if(error){
            console.error('Fetch error:', error);
            return NextResponse.json({ error: 'Failed to fetch notification'}, { status: 500});
        }
        if(!data){
            return NextResponse.json({message: 'No Request yet'},{status: 201})
        }

        return NextResponse.json(data, { status: 200});
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Server error:'}, { status: 500});
    }
}