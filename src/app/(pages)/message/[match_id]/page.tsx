'use client';
import { useEffect, useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { messageProfile, Message } from '@/lib/types';
import AppLayout from '@/components/AppLayout/applayout';
import { toast } from 'sonner';


export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<messageProfile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

 // const { profileId } = useUser(); //delaying the task so just saved the profileId in localStorage.
 
   const profileId =  localStorage.getItem('profileId')
   
  const matchId = params.match_id as string;
  useEffect(() => {

    // Perform checks outside fetchData to avoid hook issues
    if (profileId === null) {
      console.log('fetching ProfileId waiting for UserProvider');
     
      return;
    }

    if (!matchId) {
      setError('Missing match ID');
      setLoading(false);
      router.push('/message');
      return;
    }

    const fetchData = async () => {
      try {
       // console.log('Fetching match for matchId:', matchId);
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .select('user1_id, user2_id')
          .eq('id', matchId)
          .single();

        if (matchError || !match) {
          console.error('Error fetching match:', matchError?.message);
          setError('Match not found');
          setLoading(false);
          return;
        }
        // console.log(match.user1_id)
        // console.log(match.user2_id)
        // console.log(profileId)

        if (match.user1_id !== profileId && match.user2_id !== profileId) {
          console.error('Unauthorized access: profileId not in match');
          setError('Unauthorized access to match');
          setLoading(false);
          return;
        }

        const otherUserId = match.user1_id === profileId ? match.user2_id : match.user1_id;
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, avatar')
          .eq('id', otherUserId)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching other user:', profileError?.message);
          setError('User not found');
          setLoading(false);
          return;
        }

        setOtherUser(profile); 

        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('id, match_id, sender_id, content, created_at')
          .eq('match_id', matchId)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError.message);
          setError('Error loading messages');
          setLoading(false);
          return;
        }

        setMessages(messagesData || []);
        setLoading(false);
        scrollToBottom();
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading chat');
        setLoading(false);
      }
    };

    fetchData();
  }, [profileId, matchId]);

  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel(`message:match_id=${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast('Message cannot be empty');
      return;
    }
    if (isSending) {
      console.log('Message send in progress, ignoring');
      return;
    }

    setIsSending(true);
    try {
      // const messageId = crypto.randomUUID();
      // console.log('Sending message:', {
      //   id: messageId,
      //   match_id: matchId,
      //   sender_id: profileId,
      //   content: newMessage.trim(),
      // });

      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: profileId,
          content: newMessage.trim(),
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error sending message:', error.message);
        setError('Error sending message');
        setIsSending(false);
        return;
      }

      //console.log('Message inserted successfully:', messageId);
      setNewMessage('');
      setIsSending(false);
    } catch (err) {
      console.error('Send error:', err);
      setError('Error sending message');
      setIsSending(false);
    }
  };

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center"><span className='loader'></span></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <AppLayout>
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      
   
      {otherUser && (
        <div className="mb-4 flex items-center gap-3">
         <ChevronLeft size={30} onClick={()=>router.back()}/>
          
          {otherUser.avatar ? (
            <img
              src={`${otherUser.avatar}`}
              alt={otherUser.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
             onError={(e) => {
             e.currentTarget.style.display = 'none';
               (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
           }}
            />
            
          ) : null}
          
          <div
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
            style={{ display: otherUser.avatar ? 'none' : 'flex' }}
          >
            {otherUser.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 className="text-xl font-semibold">{otherUser.name || 'User'}</h1>
        </div>
      )}

      <Card className="mb-4">
        <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 flex ${msg.sender_id === profileId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-2 ${
                    msg.sender_id === profileId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
    </AppLayout>
  );
}