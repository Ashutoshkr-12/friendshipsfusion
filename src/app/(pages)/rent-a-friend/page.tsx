"use client";
import {  useEffect, useState } from "react";
import { Bell, BellRing } from 'lucide-react';
import AppLayout from "@/components/AppLayout/applayout";
import RentalGrid from "@/components/rental/rental";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@/hooks/profileIdContext";
import { supabase } from "@/utils/supabase/supabase";

interface CurrentProfile {
  name: string;
  age: number;
  location: string;
  hourly_rent: number;
  availability: boolean;
}
const Rent = () => {
  const { profileId } = useUser();
  const [ member, setMember] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentProfile | null>(null);
  const [ rentalProfiles, setRentalprofiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState< string | null>(null);
  const [availibility, setAvailibility] = useState(true);

  // checking if current user has a rental profile
 useEffect(()=>{
   const checkRentalprofile= async()=>{
    const { data: profile, error} = await supabase
    .from('rental_profiles')
    .select('name,age,location,hourly_rent,availability')
    .eq('profile_id', profileId)
    .single();

    if(error){
      console.error('error in fetching rental profile in rent-a-freiend page:', error.message)
    };
    if(profile){
      setCurrentUser(profile);
      setMember(true);
    }else{
      setMember(false)
    }
   };

   if(profileId){
    checkRentalprofile();
   }

  },[ profileId])

  //fetching rental user profile 
  useEffect(()=>{
    const fetchRentalProfiles = async()=>{
      setLoading(true);
      const res = await fetch('/api/rentalprofile');
      if(!res.ok){
        const message = await res.json();
        setError(message);
        return;
      }
      const data = await res.json();
      
17
      if(data.profiles){
        setRentalprofiles(data.profiles);
      }

      setLoading(false);
  }
  fetchRentalProfiles();
  },[])
  if(error){
    return <p className="text-red-500 w-full h-screen flex items-center justify-center">{error}</p>
  }

  return (
    <AppLayout>
      <div className="container mx-auto overflow-x-hidden py-6 max-w-7xl">
        <div className="w-full flex items-center justify-between px-4 mb-2">
          <h1 className="text-2xl font-bold mb-2 px-4">Rent a Friend</h1>
          <div className="flex items-center gap-8">
         
    
          {member ?
          <>
          <div>
          <Link href={`/rent-a-friend/booking-request/${profileId}`}> <Bell size={30}/></Link>
          </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="/avatar.png" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="flex flex-col gap-3 border-b">
                <DropdownMenuItem>
                  Name
                  <DropdownMenuShortcut>{currentUser?.name}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Age
                  <DropdownMenuShortcut>{currentUser?.age}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Location
                  <DropdownMenuShortcut>{currentUser?.location}</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Hourly rate
                  <DropdownMenuShortcut>{currentUser?.hourly_rent}$</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <span>Available</span>
                    <Switch
                      checked={availibility}
                      onCheckedChange={setAvailibility}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="w-full" href={`/rent-a-friend/${profileId}`}>
                    <Button className="w-full">More Info</Button>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Button className="w-full">Logout</Button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </>
           : <div>
            <Link href={`/rent-a-friend/profile-form`}>
            <Button className="bg-blue-400 hover:bg-white cursor-pointer">Become a friend</Button>
            </Link>
                        </div>}
            </div>
        </div>
        <p className="text-gray-600 mb-6 px-4">
          Find someone to hang out with, explore the city, or accompany you to
          events
        </p>
        {loading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <span className="loader"></span>
          </div>
        ) : (
          <RentalGrid profiles={rentalProfiles} />
        )}
        
      </div>
    </AppLayout>
  );
};

export default Rent;
