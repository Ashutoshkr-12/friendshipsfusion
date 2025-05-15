"use client";
import { useUser } from "@/hooks/profileIdContext";
import { RentalProfile, Review } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { supabase } from "@/utils/supabase/supabase";
import { DialogDescription } from "@radix-ui/react-dialog";
import Reviewpage from "./reviewTable";

export default function RentalProfilePage({
  profile,
  rental_id,
}: {
  profile: RentalProfile;
  rental_id: string;
}) {
  const { profileId } = useUser();
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [hourlyrent, setHourlyrent] = useState<number>(profile.hourly_rent);
  const [services, setServices] = useState(profile.services);
  //rental request states
  const [service, setService] = useState<string | null>();
  const [dateTime, setDateTime] = useState<string>();
  const [duration, setDuration] = useState<string>();
  const [message, setMessage] = useState<string>();
  /// dialog open and close
  const [open, setOpen] = useState<boolean>(false);

  //fetching profile reviews
  const [data, setData] = useState<Review[]>([]);

  const isOwner = profileId === profile.profile_id;
  //console.log(isOwner);

  //handle rentals
  const handleRentFriend = async () => {
    setLoading(true);
    setIsBooking(true);
    const serviceArray = service?.split(",").map((i) => i.trim());
    console.log(serviceArray);
    const { data: request, error: bookingError } = await supabase
      .from("booking_request")
      .insert({
        rentalprofile_id: rental_id,
        user_id: profileId,
        services: serviceArray,
        duration,
        status: false,
        when: dateTime,
        message,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Error in sending request:", bookingError.message);
    }
    if (bookingError?.code === "23505") {
      toast("Request already sent. Just wait for them to free.");
    } else {
      // Simulate booking process
      setIsBooking(false);
      toast(`Request sent! Hope ${profile.name} is free to chill soon 💬`);
    }

    if (request) {
      const { error: NotifyError } = await supabase
        .from("notifications")
        .insert({
          user_id: request.rentalprofile_id,
          from_user_id: request.user_id,
          type: "booking_request",
          is_read: false,
          metadata: { booking_id: request.id },
        });

      if (NotifyError) {
        console.error(
          "Error in sending booking notification:",
          NotifyError.message
        );
      }
    }
    setOpen(false);
    setLoading(false);
  };

  // updating the profile by the owner
  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("rental_profiles")
      .update({
        name,
        bio,
        location,
        height,
        weight,
        hourly_rent: hourlyrent,
        services,
      })
      .eq("profile_id", profileId);

    if (error) {
      console.error("Update failed:", error);
      toast("Error in updating your profile");
    } else {
      toast("Profile updated successfully");
      window.location.reload();
    }
    setOpen(false);
    setLoading(false);
  };

  //fetching comments
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const { data: reviews, error } = await supabase
          .from("reviews")
          .select(
            `id,rentalprofile_id,user_id,rating,comment,created_at,profiles:user_id(name,avatar)`
          )
          .eq("rentalprofile_id", rental_id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error in fetching reviews:", error.message);
        }

        if (reviews) {
          setData(reviews);
        }
      } catch (error) {
        console.error("Error in fetching reviews:", error);
      }
    };
    fetchReview();

    const channel = supabase
      .channel("realtime-reviews")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
          filter: `rentalprofiles_id=eq.${rental_id}`,
        },
        (payload) => {
          const newReview = payload.new as Review;
          setData((prev: Review[]) => [newReview, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rental_id]);

 // console.log(profile.photo_url);
  return (
    <>
      <div className="max-w-4xl mx-auto">
        {isOwner ? (
          <>
            <h1 className="px-auto py-1 text-lg text-red-500 ">
              NOTE : Accepting payment is on you, after service or before
              service.
            </h1>
          </>
        ) : null}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Photos and basic info */}
          <div className="flex-1">
            <Card className="w-full max-w-md mx-auto md:h-full">
              <CardContent className="p-0">
                <div className="flex overflow-x-auto space-x-2 no-scrollbar snap-x snap-mandatory">
                   <Carousel className="w-full h-full">
      <CarouselContent>
        { Array.isArray(profile.photo_url) ? profile.photo_url.map(( photo, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center ">
                  <img className="text-4xl font-semibold" src={photo} />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )) : (null)}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

                </div>
                
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="w-full md:w-1/2 ">
            <Card>
              {!isOwner ? (
                <>
                  <CardHeader className="">
                    <h2 className="text-lg font-semibold">Book a Hangout</h2>
                  </CardHeader>
                </>
              ) : null}
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {profile.name}, {profile.age}
                    </h1>
                    {/* <div className="flex items-center mt-1 text-yellow-500">
                      <Star size={18} className="fill-yellow-500" />
                      <span className="ml-1">
                        {4.8} ({147} reviews)
                      </span>
                    </div> */}
                    <div className="flex items-center mt-2 text-gray-500">
                      <MapPin size={18} />
                      <span className="ml-1">{profile.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      ${profile.hourly_rent}/hr
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">About Me</h2>
                  <p className="text-gray-700 break-words whitespace-pre-line">
                    {profile.bio}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Height :</h2>
                  <p className="text-gray-400 text-md">{profile.height} cm</p>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Weight :</h2>
                  <p className="text-gray-400 text-md">{profile.weight} kg</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>
                    Available:
                    {profile.availability ? (
                      <span className="text-green-400">Online</span>
                    ) : (
                      <span className="text-red-400">Offline</span>
                    )}
                  </span>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2 line-clamp-2">
                    {profile.services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {/* edit  or rent a friend */}
                {isOwner ? (
                  <>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className=" max-h-[90vh] overflow-y-auto scrollbar-hidden">
                        <DialogHeader>
                          <DialogTitle>Edit your profile</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              onChange={(e) => setName(e.target.value)}
                              defaultValue={profile.name}
                            />
                          </div>
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              onChange={(e) => setBio(e.target.value)}
                              defaultValue={profile.bio}
                            />
                          </div>
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              onChange={(e) => setLocation(e.target.value)}
                              defaultValue={profile.location}
                            />
                          </div>
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label htmlFor="height">Height</Label>
                            <Input
                              id="height"
                              onChange={(e) =>
                                setHeight(parseFloat(e.target.value))
                              }
                              type="number"
                              defaultValue={profile.height}
                            />
                          </div>
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label htmlFor="weight">Weight</Label>
                            <Input
                              id="weight"
                              onChange={(e) =>
                                setWeight(parseFloat(e.target.value))
                              }
                              type="number"
                              defaultValue={profile.weight}
                            />
                          </div>
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label htmlFor="hourly_rent">Hourly rent</Label>
                            <Input
                              id="hourly_rent"
                              onChange={(e) =>
                                setHourlyrent(parseFloat(e.target.value))
                              }
                              type="number"
                              placeholder="In Dollers"
                              defaultValue={profile.hourly_rent}
                            />
                          </div>
                          <div className="grid gap-2 mb-4 p-4  border rounded-lg">
                            <Label>Services</Label>
                            <div className="flex flex-wrap gap-2">
                              <Input
                                onChange={(e) =>
                                  setServices(
                                    e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                  )
                                }
                                defaultValue={profile.services}
                              ></Input>

                              <span className="text-sm text-gray-400">
                                Add more services separated by comma ...
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="bg-purple-600 text-lg font-bold"
                          onClick={handleUpdate}
                        >
                          {loading ? (
                            <span className="bg-gray-400 w-full rounded">
                              updating your data...
                            </span>
                          ) : (
                            ' Save'
      
                          )}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          disabled={isBooking}
                        >
                          Rent this friend
                        </Button>
                      </DialogTrigger>
                      <DialogDescription></DialogDescription>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-xl tracking-tight border-b-2 pb-2 font-sans">
                            Send a slot booking request
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="">
                            <Label
                              htmlFor="service"
                              className="text-lg font-bold text-right"
                            >
                              Services you want...
                            </Label>
                            <Input
                              id="service"
                              onChange={(e) => setService(e.target.value)}
                              className="col-span-3"
                              placeholder="Career advice, Dating, etc..."
                            />
                          </div>
                          <div className=" items-center gap-4">
                            <Label
                              htmlFor="time"
                              className="text-lg font-bold text-right"
                            >
                              When
                            </Label>
                            <Input
                              id="time"
                              onChange={(e) => setDateTime(e.target.value)}
                              type="datetime-local"
                              className="col-span-3"
                            />
                          </div>
                          <div className="items-center gap-4">
                            <Label
                              htmlFor="duration"
                              className="text-lg font-bold text-right"
                            >
                              Duration
                              <span className="text-[10px] line-clamp-1 tracking-tighter ">
                                In Hours
                              </span>
                            </Label>
                            <Input
                              id="duration"
                              onChange={(e) => setDuration(e.target.value)}
                              type="number"
                              className="col-span-3"
                            />
                          </div>
                          <div className="items-center gap-4">
                            <Label
                              htmlFor="message"
                              className="text-lg font-bold text-right"
                            >
                              Message
                            </Label>
                            <Input
                              id="message"
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Any instruction"
                              type="text"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleRentFriend}>
                            Send Request
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}

        <Reviewpage rental_id={rental_id} data={data} />
      </div>
    </>
  );
}
