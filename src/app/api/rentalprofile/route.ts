import {supabase} from '@/utils/supabase/supabase'
import { NextResponse } from 'next/server'

export async function GET(){
     

     const { data , error} = await supabase
     .from('rental_profiles')
     .select('*')

     if(error){
        return NextResponse.json({ error: error.message}, { status: 500})
     }
     if(!data){
      return NextResponse.json({ message: 'No profile to show'}, { status: 404})
     }

     return NextResponse.json({ profiles: data}, { status: 200})
}