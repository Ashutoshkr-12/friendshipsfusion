'use client'
import {  CircleArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Notification as NotifyType } from "@/lib/types";
import { toast } from "sonner";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function NotificationPage() {
  const [ notification, setNotification] = useState< NotifyType[] | null>(null);
  const [ loading, setLoading] = useState< boolean>(false);
  const [ message, setMessage] = useState< string >('');
  const [ profile_id, setProfileId] = useState('');
 const router = useRouter();
 const params = useParams();


//current user id
 useEffect(()=>{
  const fetchNotifications= async () =>{
    setLoading(true);
    const profile_id =  params.profile_id as string;
    setProfileId(profile_id)
  
    try {
      const response = await fetch(`/api/notification?profile_id=${profile_id}`,{
        headers: {
          'Content-type' : 'application/json',
        },
      });
      if(!response.ok){
        const errorData = await response.json();
        console.error("API error:", errorData);
        setMessage(`Failed to load notifications: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      //console.log(data)

      if(data.length === 0){
        setMessage('No matches yet');
      }

      setNotification(data as NotifyType[]);
    } catch (error) {
      console.error('Fetch error from client side:',error);
      setMessage("Error fetching notifications");
    } finally{
      setLoading(false);
    }

 
//  //fetching notifications
//     try {
//       const { data , error:NotifyError}= await supabase
//       .from('notifications')
//       .select('  id, created_at,user_id,type,from_user_id,is_read,  profiles:profiles!notifications_from_user_id_fkey (name, avatar)')
//       .eq('user_id', profile_id)
//       .order('created_at', { ascending: false});

// //console.log(data);
//       if(NotifyError){
//         console.error('Error in fetching notification',NotifyError)
//       }
//       if(data?.length === 0){
//         setMessage('No matches yet')
//       }

    
//       setNotification(data as NotifyType[]);
      
//     } catch (error) {
//       console.error('Error in processing request', error);
//     } finally{
   
//     }


};
  fetchNotifications();

  const subscription = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'notifications' ,filter: `user_id=eq.${params.profile_id}`},
    (payload)=>{
      console.log('New notification:', payload.new);
      setNotification((prev) => [payload.new as NotifyType, ...(prev || [])]);
    }
  )
  .subscribe();

  return ()=>{
    supabase.removeChannel(subscription);
  }
 },[params]);
//  console.log(notification)
// console.log(profile_id);

 const handleAction = async (notificationId: string, action: 'accepted' | 'rejected')=>{
   try {
     const notif = notification?.find((n)=> n.id === notificationId);
     if(!notif || !profile_id){
       console.error('no notification id found', notif, profile_id)
       return;
      }
      let match_id: string;
    if(action === 'accepted'){
    const { data: existingMatch, error: matchCheckError} = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${profile_id},user2_id.eq.${notif.from_user_id}),and(user1_id.eq.${notif.from_user_id},user2_id.eq.${profile_id})`)
    .maybeSingle<{ id: string }>();

    if(existingMatch){
      toast('Match is created redirecting to messages...')
      router.push(`/message`);
      return;
    }


    if(matchCheckError && matchCheckError.code !== 'PGRST116'){
      console.error('Error checking match:', matchCheckError.message);
      setMessage('Error in processing match');
      return;
    }

   if(!existingMatch)
      {
      const { data: match, error: matchError}= await supabase
      .from('matches')
      .insert({
        user2_id:  profile_id,   // here userid is the user who liked me back
        user1_id: notif.from_user_id,    //here notif.from_user_id is mee
        created_at: new Date().toISOString(),
        type: 'match',
      })
      .select('id')
      .single();
      
      // console.log(match);

      if(matchError){
        console.error('Error in creating match:', matchError.message);
        toast('Match is already created')
        return;
      }

      const {error: notifyError} = await supabase
      .from('notifications')
      .insert({
      user_id: notif.from_user_id,
      type: 'match',
      from_user_id: profile_id,
      metadata: {match_id: match.id},
      created_at: new Date().toISOString(),
    })

      if(notifyError){
        console.error('error in inserting match notificatoion:',notifyError.message);
        toast('Match created ,but failed to send notification');
      }

      const { error: updateError} = await supabase
      .from('notifications')
      .update({ is_read: true})
      .eq('id',notificationId);
      // console.log(notificationId);

      if(updateError){
        console.error('Error marking notification as read:',updateError.message);
      }
      toast('Its a match')

       match_id = match?.id;
       console.log(match_id)
       
       const {error: messageError} = await supabase
       .from('messages')
       .insert({
        match_id: match_id,
        sender_id: profile_id,   // if other user likes me back then a dummy message has been sended from there side to mee..
        receiver_id:notif.from_user_id,  // and im the receiver who recieved the message
        content: 'Heyy',
        created_at: new Date().toISOString,
       });

       if(messageError){
        console.error('Error in sending messages :', messageError.message);
       }
    
     }else{
     // match_id = existingMatch.id;
      console.log('profile already liked');
    }
    router.push(`/message`)

////////delete the request after rejection......
    }else if(notif.type === 'like' && action === 'rejected'){
      //delete the user like

      const {error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('liker_id', notif.from_user_id)
      .eq('liked_id',profile_id);

      if(deleteError){
        console.error('Error in deleting like', deleteError.message);
        return;
      }
    
      const {error: updateError} = await supabase
      .from('notifications')
      .delete()
      .eq('id',notificationId);
      
      if(updateError){
        console.error('error in deleting notification', updateError.message)
        return;
      }
      window.location.reload();
  }


}catch (error) {
    console.error('Error in notification function:',error);
  }
 }

 //loading handler
 if (loading) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span className="loader"></span>
    </div>
  );
}
 
return (
  <div className="p-4 sm:p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl font-semibold mb-4 flex items-center gap-3">
      <CircleArrowLeft size={26} onClick={() => router.back()} />
      Notifications
    </h1>

    <div className="space-y-4">
      {message && !loading && (
        <p className="text-center py-6 text-2xl text-red-600">{message}</p>
      )}
      {notification?.map((notif) => (
        <Card key={notif.id}>
          <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
            <div className="flex items-center gap-4">
              <img
                src={notif.profiles?.avatar || '/default-avatar.png'}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                {notif.type === 'like' && (
                  <>
                    <p className="text-sm">
                      <span className="pl-2 text-sm font-semibold">{`${notif.profiles?.name || 'Unknown'} sent you a match request – feeling the vibe? 👀`}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(parseISO(notif.created_at), { addSuffix: true })}
                    </p>
                  </>
                )}
                {notif.type === 'match' && (
                  <>
                    <p className="text-sm">
                      <span className="font-bold">{notif.profiles?.name || 'Unknown'}</span>
                      <span className="pl-2 text-sm font-extralight"> said yes! Go say hey 👋</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(parseISO(notif.created_at), { addSuffix: true })}
                    </p>
                  </>
                )}
               
                {notif.type === 'booking_request' && !notif.is_read &&(
                  <>
                  <div className="flex items-center gap-2 sm:gap-6">
                    <div>
                    <p className="text-sm">
                      <span className="pl-2 text-lg font-extralight">{`${notif.profiles?.name || 'Someone'} wants to rent your time - check their request!`}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(parseISO(notif.created_at), { addSuffix: true })}
                    </p>
                    </div>
                    <Link href={`/rent-a-friend/booking-request/${profile_id}`}>
                    <Button>See request</Button>
                    </Link>
                    </div>
                  </>
                )}
                {notif.type === 'booked' && (
                  <>
                  <div className="flex items-center gap-2 sm:gap-20">
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">{notif.profiles?.name || 'Unknown'}</span>
                      <span className="pl-2 text-sm font-extralight">{`is in! Let the hangout begin 🎉`}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(parseISO(notif.created_at), { addSuffix: true })}
                    </p>
                    </div>
                    <Link href={`/message`}>
                    <Button>View chat</Button>
                    </Link>
                    </div>
                  </>
                )}
              
              </div>
            </div>

            <div className="flex gap-2">
              {notif.type === 'like' && !notif.is_read && (
                <>
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleAction(notif.id, 'accepted')}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleAction(notif.id, 'rejected')}
                  >
                    Reject
                  </Button>
                </>
              )}
              {notif.type === 'match' && (
                <Link href={`/message`}>
                  <Button variant="outline">View Chat</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
 
}
   