'use server'
import Rules from '@/components/ProceedToPayment/rules';
import { getUsersession } from '@/serverActions/authAction';
import { supabase } from '@/utils/supabase/supabase';

export default async function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Get the user
const session = await getUsersession();

if (!session || !session.user?.id) {
  return <Rules />;
}

const user = session.user.id
//console.log(session.user.id);
   
  

  // Fetch premium status from profiles table
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('premium_status')
    .eq('user_id', user)
    .single();

  const status = profile?.premium_status === true;

  return <>{status ? children : <Rules />}</>;
}
