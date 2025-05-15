'use client'
import RequestsList from "@/components/rental/Requestspage";
import { rentalRequest } from "@/lib/types";
import { supabase } from "@/utils/supabase/supabase";
import { CircleArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function Requestpage(){
    const [request,setRequest] = useState< rentalRequest[] | null>(null);
    const [message,setMessage] = useState< string | null>();
    const [profileId, setProfileId] = useState< string>();
    const [loading, setLoading] = useState< boolean >(false);
    const params = useParams();
    const router = useRouter();


    
    useEffect(()=>{
        const fetchRequest = async()=>{
            setLoading(true);
            const profileid = params.profile_id as string;
            setProfileId(profileid);
            //console.log(profileid); // Use profileid directly instead of profileId

        try {
            const response = await fetch(`/api/booking-request?profile_id=${profileid}`,{
                headers: {
                    'Content-type' : 'application/json',
                },
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error('API error', errorData);
                return;
            }

            const data = await response.json();
          
            setRequest(data as rentalRequest[])

        } catch (error) {
            console.error('Error in fetching request:',error);
            setMessage('Error fetching requests');
        } finally{
            setLoading(false);
        }
    }
    fetchRequest();

    const subscription = supabase
    .channel('booking_request')
    .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'booking_request', filter: `user_id=eq.${params.profile_id}`},
        (payload)=>{
            console.log('New requests:',payload.new);
            setRequest((prev) => [payload.new as rentalRequest, ...(prev || [])]);
        }
    )
    .subscribe();

    return () =>{
        supabase.removeChannel(subscription);
    }
},[params]);


const handleAction = async (requestedId: string, action: 'accepted' | 'rejected')=>{
    try{
        const notif = request?.find((n)=> n.id === requestedId);
        if(!notif ){
            console.error('No requests id found:',notif);
            return;
        }
        console.log('this is notif',notif);
        let match_id: string;
        if(action === 'accepted'){
            //checking if match exists
            const { data: existingMatch, error: matchCheckError} = await supabase
            .from('matches')
            .select('id')
            .or(`and(user1_id.eq.${profileId},user2_id.eq.${notif.rentalprofile_id}),and(user1_id.eq.${notif.rentalprofile_id},user2_id.eq.${profileId})`)
            .maybeSingle();

            if(existingMatch){
                toast('Match is already created redirecting to message...');
                router.push(`/message`)
            }
            if(matchCheckError && matchCheckError.code){
                console.error('Error in checking booking match:', matchCheckError.message);
                return;
            }
//if match not exist
            if(!existingMatch){
                const { data: match, error: matchError} = await supabase
                .from('matches')
                .insert({
                    user1_id: notif.user_id,
                    user2_id: notif.rentalprofile_id,
                    type: 'booked',
              
                })
                .select('id')
                .single()
                
                match_id = match?.id;
                console.log(match_id);
                if(matchError){
                    console.error('Error in creating bookking match:', matchError.message);
                }

                const { error: notifyError} = await supabase
                .from('notifications')
                .insert({
                    user_id: notif.user_id,
                    type: 'booked',
                    from_user_id: notif.rentalprofile_id,
                    metadata: {booked_id: match_id}
                })

                if(notifyError){
                    console.error('Error in inserting booking notification:', notifyError);
                }


                console.log(requestedId);
                const {error: updateError} = await supabase
                .from('notifications')
                .update({is_read: true})
                .eq('user_id', notif.user_id)
                .eq('from_user_id', notif.rentalprofile_id)

                if(updateError){
                    console.error('Error in marking notification as read:', updateError.message);
                }
                
                const { error: updateBookingError} = await supabase
                .from('booking_request')
                .update({status: true })
                .eq('id', requestedId);

                if(updateBookingError){
                    console.error(`Error in updating booking status: ${updateBookingError.message}`)
                }

                
                const { error: messageError} = await supabase
                .from('messages')
                .insert({
                    match_id: match?.id,
                    sender_id: notif.rentalprofile_id,
                    receiver_id: notif.user_id,
                    content: 'Hey are there???',
                    created_at: new Date().toISOString,
                });

                if(messageError){
                    console.error('Error in seding message:', messageError.message);
                }
            }
            router.push(`/message`);
        }else if(action === 'rejected'){
            
      const {error: deleteError } = await supabase
      .from('booking_request')
      .delete()
      .eq('id', requestedId);

      if(deleteError){
        console.error('Error in deleting like', deleteError.message);
        return;
      }

      const {error: updateError} = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', notif.rentalprofile_id)
      .eq('from_user_id', notif.user_id)
      
      if(updateError){
        console.error('error in deleting notification', updateError.message)
        return;
      }
      window.location.reload();
        }
    }catch(error){
        console.error('Error in notification function:',error);
    }
}

if(loading){
    return(
        <div className="w-full h-screen flex items-center justify-center">
            <span className="loader"></span>
        </div>
    )
};

if(request?.length === 0){
    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <CircleArrowLeft size={26} onClick={() => router.back()} />
          Requests
        </h1>
        <div className="flex flex-col items-center justify-center p-8  rounded-lg">
          <h3 className="text-xl font-medium text-white mb-2">No requests yet</h3>
          <p className="text-gray-400 text-center">
            When someone requests to meet with you, it will appear here.
          </p>
        </div>
        </div>
      );
}

return(
   
    <div className="px-6 py-2 ">
<h1 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <CircleArrowLeft size={26} onClick={() => router.push(`/rent-a-friend`)} />
          Requests
        </h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {message && !loading && (
        <p className="text-center py-6 text-2xl text-red-600">{message}</p>
      )}
      {request?.map((notif) => (
        <RequestsList key={notif.id} request={notif} action={handleAction}/>
      ))}
       
    </div>
  </div>
)

    
}