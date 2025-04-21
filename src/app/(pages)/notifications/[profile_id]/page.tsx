// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/utils/supabase/supabase';
// import { Notification } from '@/lib/types';
// import { userdata } from '@/hooks/userdata';
// import { useUser } from '@/hooks/profileIdContext';

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [ userId, setUserid] = useState<string | null>();
//   const { profileId } = useUser();
//   const [notification, setNotification] = useState<{ id: string; type: string; from_user_id: string; created_at: string; is_read: boolean; }[] | null>(null);

//   useEffect(()=>{
//     const fetchUserid = async()=>{
//       const Id = await userdata();
//       const userId = Id?.userId
//       setUserid(userId);
//     }
//     fetchUserid();
//   },[])

//   useEffect(()=>{
//     const fetchNotifcations=async()=>{
//     const { data, error } = await supabase
//     .from('notifications')
//     .select('id, type, from_user_id, created_at, is_read')
//     .eq('user_id', profileId)
//     .order('created_at', { ascending: false });
//   if (error) throw error;
//   const notifi= data ;
//   setNotification(notifi);
//     }
//     fetchNotifcations();
//   },[])

//   console.log(notification);

//   useEffect(() => {
//     const loadNotifications = async () => {
//       try {
//         setLoading(true);     
        
//       const enrichedNotifications = await Promise.all(
     
//           notification.map(async (notif) => {
//           const { data: sender }: { data: { name: string } | null } = await supabase
//             .from('profiles')
//             .select('name')
//             .eq('id', notif.from_user_id)
//             .single();
//           return { ...notif, senderName: sender?.name || 'Unknown User' };
//         })
//       );
//       setNotifications(enrichedNotifications);
//     } catch (err) {
//       console.error('Failed to load notifications:', err);
//       setError('Couldn’t load notifications. Try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };
       


//     loadNotifications();

//     const channel = supabase
//       .channel('notification-updates')
//       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
//         if (payload.new.user_id === supabase.auth.getUser().then(({ data: { user } }) => user?.id)) {
//           loadNotifications();
//         }
//       })
//       .subscribe();

//     return () => {
//       channel.unsubscribe();
//     };
//   }, []);

//   const handleMarkRead = async (id: string) => {
//     const { error } = await supabase
//       .from('notifications')
//       .update({ is_read: true })
//       .eq('id', id);
//     if (error) {
//       console.error('Error marking as read:', error.message);
//     } else {
//       setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
//     }
//   };

//   if (loading) return <p className="text-center py-6">Loading...</p>;
//   if (error) return <p className="text-center py-6 text-red-600">{error}</p>;
//   if (notifications.length === 0) return <p className="text-center py-6">No notifications yet.</p>;

//   return (
//     <div className="max-w-md mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Notifications</h1>
//       <ul className="space-y-3">
//         {notifications.map((notif) => (
//           <li key={notif.id} className={`p-3 rounded-lg shadow ${notif.is_read ? 'bg-gray-100' : 'bg-white'}`}>
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-medium">
//                   {notif.type === 'like' ? `${notif.senderName} liked you` : `${notif.senderName} is a match!`}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {new Date(notif.created_at).toLocaleTimeString()} - {new Date(notif.created_at).toLocaleDateString()}
//                 </p>
//               </div>
//               {!notif.is_read && (
//                 <button
//                   onClick={() => handleMarkRead(notif.id)}
//                   className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
//                 >
//                   Read
//                 </button>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
'use client'
import { BellIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { Notification as NotifyType } from "@/lib/types";
import { toast } from "sonner";
import { formatDistanceToNow, parseISO } from "date-fns";


export default function NotificationPage() {
  const [ notification, setNotification] = useState<NotifyType[] | null>(null);
  const [ loading, setLoading] = useState< boolean>(false);
  const [ message, setMessage] = useState< string >('');
  const [ userid, setUserid] = useState('');
  const params = useParams();


//current user id
 useEffect(()=>{
  const fetchNotifications = async () =>{

    setLoading(true);
 const profile_id =  params.profile_id as string;
setUserid(profile_id)
   
 //fetching notifications
    try {
      const { data , error:NotifyError} = await supabase
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

 let matchId: string;
 const handleAction = async (notificationId: string, action: 'accepted' | 'rejected')=>{
  try {
    const notif = notification?.find((n)=> n.id === notificationId);
    if(!notif || !userid){
      console.error('no notification id found', notif, userid)
      return;
    }
    if(action === 'accepted'){
    const { data: existingMatch, error: matchCheckError} = await supabase
    .from('matches')
    .select('id')
    //.or(`and(user1_id.eq.${userid},user2_id.eq.${notif.from_user_id}),and(user1_id.eq.${notif.from_user_id},user2_id.eq.${userid})`)
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
        user2_id:  userid,
        user1_id: notif.from_user_id,
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

       matchId = match?.id;
      // console.log(matchId)
    
    
     }else{
      matchId = existingMatch.id;
      console.log('profile already liked');
    }

    }
  } catch (error) {
    
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
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <BellIcon className="w-6 h-6" />
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
                 // onClick={() => handleAction(notif.id, "rejected")}
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
