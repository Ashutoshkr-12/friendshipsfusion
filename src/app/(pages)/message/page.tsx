'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabase';
import { useUser } from '@/hooks/profileIdContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { messageProfile, Match, Message } from '@/lib/types';
import AppLayout from '@/components/AppLayout/applayout';
import { RouteLoader } from '@/components/ui/routerLoader';

interface MatchWithDetails {
  id: string;
  otherUser: messageProfile;
  lastMessage: Message | null;
}

export default function ChatListPage() {
    const { profileId} = useUser();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [unread, setUnread] = useState< number >(0);
  const [otheruserId , setOtheruserid] = useState< string >();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  //fetching other user for chatlist
  useEffect(() => {
    const fetchMatches = async () => {
      try {
       // console.log('Fetching matches for profileId:', profileId);

        if(profileId){
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('id,user1_id,user2_id,created_at')
          .or(`and(user1_id.eq.${profileId}),and(user2_id.eq.${profileId})`);

        if (matchesError) {
          console.error('Error fetching matches:', matchesError.message);
          setError('Error loading conversations');
          setLoading(false);
          return;
        }

        if (!matchesData || matchesData.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }
        
        const matchDetails = await Promise.all(
          matchesData.map(async (match: Match) => {
           const otherUserId = match.user1_id === profileId ? match.user2_id : match.user1_id;
           setOtheruserid(otherUserId);
           const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, name, avatar')
              .eq('id', otherUserId)
              .single();

            const { data: lastMessage, error: messageError } = await supabase
              .from('messages')
              .select('id, content, created_at')
              .eq('match_id', match.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
 
            if (profileError) {
              console.error('Error fetching profile:', profileError.message);
              return null;
            }

            return {
              id: match.id,
              otherUser: profile as messageProfile,
              lastMessage: messageError || !lastMessage ? null : (lastMessage as Message),
            };
          })
        );
    

        setMatches(matchDetails.filter((m): m is MatchWithDetails => m !== null));
        setLoading(false);
    }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading conversations');
        setLoading(false);
      }
    };

    fetchMatches();
  }, [profileId, router]);

  //fetch unread message count
  useEffect(()=>{
 const fetchUnreadmessages = async()=>{
      try {
        
        const { count,error} = await supabase
        .from('messages')
        .select('id',{count: 'exact' , head: true})
        .in('match_id', matches.map(match => match.id))
        .eq('sender_id',otheruserId)
        .eq('is_read', false);

        if(error){
          console.error("Error in fetching messages unread count:", error.message);
        }

        setUnread(count || 0);
      } catch (error) {
         console.error('Unexpected error in fetching unread messages:',error)
      }
    }
    if(matches.length >0){
      fetchUnreadmessages();
    }

      const channel = supabase
    .channel('realtime-unread-messages')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages' },
      payload => {
        const newMessage = payload.new;
        // Optional filter: only refetch if new message belongs to a match
        if (matches.some(m => m.id === newMessage.match_id)) {
          fetchUnreadmessages();
          setTimeout(() => {
            // delay a bit to make sure DB updates
            const evt = new Event("refresh-unread");
            window.dispatchEvent(evt);
          }, 500);
        }
      }
    )
    .subscribe();

  const refreshHandler = () => {
    fetchUnreadmessages();
    setUnread(0);
  };

  window.addEventListener("refresh-unread", refreshHandler);

  return () => {
    supabase.removeChannel(channel);
    window.removeEventListener("refresh-unread", refreshHandler);
  };
  },[otheruserId,matches]);


  //marking mark as read
  const handleMarkasRead = async({id}:{id: string})=>{
    const {error} = await supabase
    .from('messages')
    .update({is_read: true})
    .eq('match_id',id)
    .eq('sender_id',otheruserId);
    

    if(error){
      console.log('Error in marking message is read',error.message);
    };
  }

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center"><span className='loader'></span></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }
//console.log(otheruserId);
  return (
 <AppLayout>
    <div className="p-4 sm:p-6 max-w-3xl mx-auto select-none">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No conversations yet</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <RouteLoader href={`/message/${match.id}`} key={match.id} >
              <Card className="hover:bg-gray-200 hover:text-black transition overflow-hidden" onClick={()=>handleMarkasRead({id: match.id})}>
                <CardContent className="flex items-center gap-4 p-4">
                  {match.otherUser.avatar ? (
                    <img
                      src={`${match.otherUser.avatar}`}
                      alt={match.otherUser.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
                    style={{ display: match.otherUser.avatar ? 'none' : 'flex' }}
                  >
                    {match.otherUser.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                    
            
                  <div className="flex-1">
                    <p className="font-semibold">{match.otherUser.name || 'User'}</p>
                    {match.lastMessage ? (
                      <>
                        <p className="text-sm text-gray-500 truncate">
                          {match.lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDistanceToNow(parseISO(match.lastMessage.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                        <div className='flex w-full justify-end'>
                {unread >0 && (
                  <span className=' w-7 h-7 inline-flex items-center justify-center px-1.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
             {unread}
            </span>
          )}
          </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No messages yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </RouteLoader>
          ))}
        </div>
      )}
    </div>
  </AppLayout>
  );
}