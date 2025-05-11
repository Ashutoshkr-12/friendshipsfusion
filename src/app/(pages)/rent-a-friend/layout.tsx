'use server';

import Rules from '@/components/ProceedToPayment/rules';
import { getUsersession } from '@/serverActions/authAction';
import { supabase } from '@/utils/supabase/supabase';

export default async function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user session
  const session = await getUsersession();

  if (!session || !session.user?.id) {
    return <Rules />;
  }

  const userId = session.user.id;

  // Fetch premium status from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('premium_status')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error checking premium status in layout:', error.message);
  }

  const isPremium = profile?.premium_status === true;

  return <>{isPremium ? children : <Rules />}</>;
}
