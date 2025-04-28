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


export default function NotificationPage() {
  const [ notification, setNotification] = useState<NotifyType[] | null>(null);
  const [ loading, setLoading] = useState< boolean>(false);
  const [ message, setMessage] = useState< string >('');
  const [ profile_id, setProfileId] = useState('');
  const params = useParams();
 const router = useRouter();


//current user id
 useEffect(()=>{
  const fetchNotifications= async () =>{

    setLoading(true);
 const profile_id =  params.profile_id as string;
 setProfileId(profile_id)
   
 //fetching notifications
    try {
      const { data , error:NotifyError}= await supabase
      .from('notifications')
      .select('  id, created_at,user_id,type,from_user_id,is_read,  profiles:profiles!notifications_from_user_id_fkey (name, avatar)')
      .eq('user_id', profile_id)
      .order('created_at', { ascending: false});

//console.log(data);
      if(NotifyError){
        console.error('Error in fetching notification',NotifyError)
      }
      if(data?.length === 0){
        setMessage('No matches yet')
      }

    
      setNotification(data as NotifyType[]);
      
    } catch (error) {
      console.error('Error in processing request', error);
    } finally{
      setLoading(false);
    }
  };
  fetchNotifications();
 },[]);

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
   // .or(`and(user1_id.eq.${profile_id},user2_id.eq.${notif.from_user_id}),and(user1_id.eq.${notif.from_user_id},user2_id.eq.${profile_id})`)
    .maybeSingle();

    if(existingMatch){
      toast('Match is already created')
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
      })
      .select('id')
      .single();
      
      // console.log(match);

      if(matchError){
        console.error('Error in creating match:', matchError.message);
        toast('Match is already created')
        return;
      }

      const {error: updateError} = await supabase
      .from('notifications')
      .update({is_read: true})
      .eq('id',notificationId);

      if(updateError){
        console.error('error marking notification as read:',updateError.message)
      }

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
      match_id = existingMatch.id;
      console.log('profile already liked');
    }
    router.push(`/message`)

////////delete the request after rejection......
    }else if(action === 'rejected'){
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
      
  }


}catch (error) {
    
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
      <CircleArrowLeft size={26} onClick={()=>router.back()}/>
        Notifications
      </h1>

      <div className="space-y-4">
        {message && !loading && (<p className="text-center py-6 text-2xl text-red-600">{message}</p>)}
        {notification?.map((notif) => (
          <Card key={notif.id}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <img
                  src={notif.profiles.avatar}
                  alt='avatar'
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-bold ">{notif.profiles.name}</span><span className="pl-2 text-sm font-extralight">sent you a matching request</span>
                  </p>
                  <p className="text-xs text-gray-500">{formatDistanceToNow(parseISO(notif.created_at),{addSuffix: true})}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                onClick={()=> handleAction(notif.id, 'accepted')}
                >
                Accept
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleAction(notif.id, "rejected")}
             
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
