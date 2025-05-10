'use client';
import { useEffect, useState, useRef } from 'react';
import { Camera, ChevronLeft } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/profileIdContext';
import { RouteLoader } from '@/components/ui/routerLoader';


export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPremium , setIsPremium] = useState< boolean >(false);
  const [otherUser, setOtherUser] = useState<messageProfile | null>(null);
  const [newMessage, setNewMessage] = useState< string >('');
  const [imageFile, setImageFile] = useState< File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>( null );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  //const profileId =  localStorage.getItem('profileId')  not a professional approach
 const { profileId } = useUser();
 
 //fetchin premium status
 useEffect(()=>{
  try {
      const fetchUserstatus = async()=>{
         if(profileId){
        const { data , error} = await supabase
        .from('profiles')
        .select('premium_status')
        .eq('id',profileId)
        .single();

        if(error){
          console.error('Error in fetching userStatus in message:',error.message);
        }
      if(data?.premium_status){
        setIsPremium(true);
      }
      }
    }    
  fetchUserstatus();
  } catch (error) {
    console.error('Unexpected error in fetching premium status in message:',error);
  }
 },[profileId]);

 console.log(isPremium)
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
      if(profileId){
          try {
        setLoading(true);
        //console.log(profileId);
       // console.log('Fetching match for matchId:', matchId);
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .select('user1_id, user2_id')
          .eq('id', matchId)
          .single();

        if (matchError || !match) {
          console.error('Error fetching match:', matchError?.message);
          setError('Match not found');
      
          return;
        }
        // console.log(match.user1_id)
        // console.log(match.user2_id)
        // console.log(profileId)

        if (match.user1_id !== profileId && match.user2_id !== profileId) {
          console.error('Unauthorized access: profileId not in match');
          setError('Unauthorized access to match');
          return;
        }
        
        setLoading(false);
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
          .select('id, match_id, sender_id, content, created_at,is_read')
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
      }
    
    };

    fetchData();
  }, [profileId, matchId]);

//realtime service
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

  const isImageUrl = (content: string): boolean => {
    //check if content is a url from the chat-images bucket
    const regex = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/chat-images\/.+$/;
  return regex.test(content);
  };



  const handleSendMessage = async ({id,otherId}:{id:string ; otherId: string | undefined }) => {
    if (!newMessage.trim() && !imageFile) {
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
      let content: string;

      //upload image if selected
      if(imageFile){
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${profileId}_${Date.now()}.${fileExt}`;
        const { error: uploadError} = await supabase.storage
        .from('chat-images')
        .upload(fileName, imageFile);

        if(uploadError){
          console.error('Image upload error:', uploadError.message);
          toast('Failed to upload image')
          return;
        }

        const { data: urlData }= supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

        content = urlData.publicUrl;
      }else{
        content = newMessage;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: id,
          receiver_id: otherId,
          content,
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
      setImageFile(null);
      if(fileInputRef.current){
        fileInputRef.current.value = ''
      }
      setIsSending(false);
    } catch (err) {
      console.error('Send error:', err);
      setError('Error sending message');
      setIsSending(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(file){
      if(file.size > 5*1024 * 1024){
        toast('Image size must be less that 5MB');
        return;
      }
      setImageFile(file);
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
          {isPremium && (
            <RouteLoader href={`/profile/${otherUser.id}`}>
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
            </RouteLoader>
          )}
          {!isPremium && (
            <>           
            <RouteLoader href={`/rent-a-friend`}>
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
          </RouteLoader>
          </>

          )}
          
          
          <div
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold"
            style={{ display: otherUser.avatar ? 'none' : 'flex' }}
          >
            {otherUser.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
          <h1 className="text-xl font-semibold">{otherUser.name || 'User'}</h1>
          <p className='text-xs text-gray-400 tracking-tight'>All the messages will be automatically deleted within 24hrs for security purposes.</p>
        </div>
        </div>
      )}

      <Card className="mb-4">
      <CardContent className="p-4 h-[50vh] overflow-y-auto flex flex-col gap-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === profileId ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender_id === profileId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  
                  {isImageUrl(msg.content) ? (
                    <img
                      src={msg.content}
                      alt="Chat image"
                      width={200}
                      height={200}
                      className="mt-2 rounded-lg max-w-full"
                    />
                  ) : (
                    <p className="mt-1">{msg.content}</p>
                  )}
                  <p className="text-xs text-gray-800 mt-1">
                    {formatDistanceToNow(parseISO(msg.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
      </Card>

      <div className="flex gap-2 bg-gray-900 py-2 px-2 rounded-md ">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage({id: profileId, otherId: otherUser?.id})}
        />
        <Input type='file'
        accept='image/*'
        onChange={handleImageChange}
        ref={fileInputRef}
        className='hidden'
        id='image-upload'/>
          <Label htmlFor='image-upload'>
        <Camera size={34} />
        </Label>
        {imageFile && <span className='text-sm text-geay-500'>{imageFile.name}</span>}
       
        <Button onClick={()=>handleSendMessage({id: profileId ,otherId: otherUser?.id})} className="bg-blue-500 hover:bg-blue-600">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
    </AppLayout>
  );
}