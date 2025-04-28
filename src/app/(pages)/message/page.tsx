'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/supabase';
import { useUser } from '@/hooks/profileIdContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';
import { messageProfile, Match, Message } from '@/lib/types';
import AppLayout from '@/components/AppLayout/applayout';

interface MatchWithDetails {
  id: string;
  otherUser: messageProfile;
  lastMessage: Message | null;
}

export default function ChatListPage() {
    const { profileId} = useUser();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center"><span className='loader'></span></div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
 <AppLayout>
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Messages</h1>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No conversations yet</p>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Link href={`/message/${match.id}`} key={match.id}>
              <Card className="hover:bg-gray-100 transition">
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
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No messages yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  </AppLayout>
  );
}