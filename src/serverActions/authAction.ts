"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: session, error } = await supabase.auth.signInWithPassword(data);

  if (!session || error) {
    redirect("/login?message=Invalid credentials");
  }

  const token = session?.session.access_token;

  if (!token) {
    redirect("/login?message=Invalid credentials");
  }
  
  // Pass the token to ProfileForm via a query parameter or shared state
  redirect(`/`);
  
}

export async function signup(formData: FormData) {
   const supabase = await createClient();

 
  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
    },
  });

  if(!error){
   revalidatePath("/login", "layout");
   redirect("/login?message=A confirmation mail has been send to your email click that link to proceed");
 }
  if(error) {
    console.error('Error from signup:', error.message);
    redirect(`/signup?message=${error.message}`);
  }
}

export async function getUsersession(){
  const supabase = await createClient();
  const {data , error} = await supabase.auth.getUser();

  if(error){
    return null;
  }
  return{ user: data?.user};
}

export async function signOut(){
  const supabase = await createClient();

  const {error}= await supabase.auth.signOut();

  if(error){
    redirect("/")
  }

  revalidatePath("/","layout");
  redirect("/login");
}


// export const confirmReset = async (formData: FormData) => {
//   const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' || "http://192.168.0.193:3000";
//   const email = formData.get('email') as string;
//   const supabase =await createClient();

  

//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: `${origin}/reset-password`,
//   });

//   if (error) {
//     return redirect('/forgot-password?message=User not found');
//   }

 
// };


// export async function resetPassword(code: string, formData: FormData) {
//   const password = formData.get('password') as string;
//   const confirmPassword = formData.get('confirmPassword') as string;

//   if (password !== confirmPassword) {
//     return redirect(`/reset-password?message=Passwords do not match`);
//   }

//   const supabase = await createClient();

//   // // Exchange the code for a session
//   // const { error: otpError } = await supabase.auth.exchangeCodeForSession(code);

//   // if (otpError) {
//   //   console.error(otpError);
//   //   return redirect(`/reset-password?message=Link expired or invalid.`);
//   // }


//   // Update the user's password
//   const { error: updateError } = await  supabase.auth.updateUser({
//     password: password,
//   });
  
//   if (updateError) {
//     console.error(updateError);
//     return redirect(`/reset-password?message=Unable to reset password.`);
//   }

//   return redirect(`/login?message=Password has been reset. Please sign in.`);
// }