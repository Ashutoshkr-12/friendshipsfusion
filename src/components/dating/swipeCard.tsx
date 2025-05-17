"use client";
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { MdInterests } from "react-icons/md";
import { profiles } from "@/lib/types";
import { MapPin, Images, Mars, MessageSquareWarning } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HiBriefcase } from "react-icons/hi2";

interface SwipeCardProps {
  profile: profiles;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    if (element.scrollTop > 50 && !expanded) {
      setExpanded(true);
    } else if (element.scrollTop < 50 && expanded) {
      setExpanded(false);
    }
  };

  if (profile) {
    return (
      <Card
        className="swipe-card rounded-xl overflow-hidden shadow-lg h-[70vh] md:h-[80vh]"
        ref={cardRef}
      >
        <ScrollArea className="h-full scroll-smooth" onScroll={handleScroll}>
            <div className="relative h-[80vh] md:h-[80vh]">
              <img
                src={profile.avatar && profile.avatar.trim() !== "" ? profile.avatar : "/avatar.png"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1/7 sm:bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-3xl font-bold">
                    {profile.name}, {profile.age}
                  </h3>
                </div>
                <p className="text-xl mb-2 flex items-end gap-1 font-semibold">
                  <MapPin />
                  {profile.location}
                </p>
                <p className="text-white/90">{profile.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.interests.map((interests, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/30 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {interests}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          {/* Scrollable detailed profile information */}
          <h1 className="px-4 mt-2 text-2xl font-semibold">More info</h1>
          <div className="bg-white dark:bg-gray-900 p-6 space-y-6">
            <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400 border-b py-2">
              <MapPin size={24} />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 text-lg text-gray-600 dark:text-gray-400 border-b py-2">
              <HiBriefcase size={26} className="font-bold" />
              <span>{profile.occupation}</span>
            </div>
            <div className=" items-center border-b py-2">
              <div className="flex items-center gap-2 font-semibold">
                <Mars size={24} />
                <p className="text-xl">Gender</p>
              </div>
              <div className=" text-md text-gray-600 dark:text-gray-400 ml-4">
                <span>{profile.gender}</span>
              </div>
            </div>

            <div className="space-y-2 border-b py-2">
              <h4 className="font-semibold text-lg flex items-center gap-1">
                <MessageSquareWarning size={20} />
                About
              </h4>
              <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
            </div>

            <div className="space-y-2 border-b py-2">
              <div className="flex items-center gap-2">
                <MdInterests size={24} />
                <h4 className="font-semibold text-lg">Interests</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Images size={24} />
              <h4 className="font-semibold text-lg">Additional Images</h4>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.photo_url && profile.photo_url.length > 0 ? (
                profile.photo_url.map((photo, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded-full"
                  >
                    <img src={photo} alt="" />
                  </div>
                ))
              ) : (
                <span className="text-gray-500">Photo</span>
              )}
            </div>

            {/* <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Instagram size={18} />
              <span>{additionalInfo.instagram}</span>
            </div>
          </div> */}
          </div>
        </ScrollArea>
      </Card>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">No profiles to show!</h2>
        <p className="text-gray-500 mb-4">Check back later for more Profiles</p>
      </div>
    );
  }
};
export default SwipeCard;
