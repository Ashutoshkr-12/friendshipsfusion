'use client'
import AppLayout from "@/components/AppLayout/applayout";
import RentalProfilePage from "@/components/rental/RentalProfilePage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default  function Page() {
  const [profile, setProfile] = useState();
  const params = useParams();
  const rental_id = params.profile_id as string;

  useEffect(()=>{
    const fetchRentalUserprofile = async() =>{
 const { data: profile } = await supabase
    .from("rental_profiles")
    .select("*")
    .eq("profile_id", rental_id)
    .single();

    if(profile){
      setProfile(profile);
    }
    }
    fetchRentalUserprofile();
  },[])
 
  if (!profile) return <div className="w-full h-screen flex items-center justify-center"><h1>Profile not found</h1></div>;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <Link href="/rent-a-friend">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rentals
          </Button>
        </Link>
        <RentalProfilePage profile={profile} rental_id={rental_id} />
      </div>
    </AppLayout>
  );
}
