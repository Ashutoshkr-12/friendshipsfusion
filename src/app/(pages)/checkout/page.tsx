'use client'
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from 'react'
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/supabase";
import { useUser } from "@/hooks/profileIdContext";
import { useRouter } from "next/navigation";

export default function Checkoutpage() {
  const { profileId } = useUser()
  const router = useRouter();
  const benefits = [
  'Access to Rent a Friend',
  'View matched users profiles',
  'Priority listing on Rent a Friend',
  'Ad-free experience',
  'Early access to new features',
];

  const handleBuyNow = async() => {
    // Redirect to payment gateway or open payment modal
  toast('Currently in developing phase');
  const { error } = await supabase
  .from('profiles')
  .update({premium_status: true})
  .eq('id',profileId);

  if(error){
    console.error('Error in premium status:',error.message);
  }else{
    router.push(`/rent-a-friend`);
  }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Upgrade to Premium</h1>
      <p className="text-center text-gray-600 mb-8">Unlock all features and enjoy a premium experience.</p>

      <Card className="shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">What you get:</h2>
          <ul className="space-y-3 mb-6">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center">
                <CheckCircle className="text-green-500 mr-2 w-5 h-5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-gray-400">Price</p>
              <p className="text-3xl font-bold">₹99/month</p>
            </div>
            <Button size="lg" onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
