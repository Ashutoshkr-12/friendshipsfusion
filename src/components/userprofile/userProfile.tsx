"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UserProfile as UserProfileType } from "@/lib/types";
import {  Settings, User, Camera, Edit, Users, LogOut, ImageIcon,} from "lucide-react"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { signOut } from "@/serverActions/authAction";
import { AspectRatio } from "../ui/aspect-ratio";

interface UserProfileProps {
  userProfile: UserProfileType;
}

const UserProfile: React.FC<UserProfileProps> = ({ userProfile }) => {
  const [tab, setTab] = useState("info");

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 border">
      {/* settings elements, avatar */}
      <div className="relative mb-8">
        <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg"></div>
        <div className="absolute -bottom-16 left-4 sm:left-8">
        <Dialog>
        <DialogTrigger asChild>
         <Avatar className="h-32 w-32  flex items-center rounded-full ring-2 ring-white object-cover bg-zinc-900">
            <img className=" rounded-full" src={userProfile.avatar} alt={userProfile.name} />
          </Avatar>
          </DialogTrigger>
          <DialogContent className="reltive overflow-hidden h-64 w-64 rounded-full object-cover flex items-center justify-center">
            <img src={userProfile.avatar} alt="" className="rounded-full"  />
          </DialogContent>
          </Dialog>
          <Button
            size="icon"
            className="absolute bottom-0 right-0 rounded-full bg-purple-600 h-8 w-8"
          >
            <Camera size={16} />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon">
                <Settings size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Email Notifications</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Receive match notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Receive message notifications
                    </span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Privacy</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show online status</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Show distance</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <Button
                  onClick={signOut}
                  variant="destructive"
                  className="w-full mt-4"
                >
                  <LogOut size={16} className="mr-2" />
                  Log Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* user profile header name age location and edit functionallity*/}
      <div className="mt-16 sm:mt-10 sm:ml-40 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {userProfile.name}, {userProfile.age}
          </h1>
          <p className="text-gray-500">{userProfile.location}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Edit size={16} />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={userProfile.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue={userProfile.bio} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={userProfile.location} />
              </div>
              <div className="grid gap-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex gap-1 items-center"
                    >
                      {interest}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="cursor-pointer">
                    + Add
                  </Badge>
                </div>
              </div>
            </div>
            <Button type="submit">Save changes</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* user bio and interest*/}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">About Me</h2>
        <p className="text-gray-600">{userProfile.bio}</p>

        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map((interest, index) => (
              <Badge key={index} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/*profile photos */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <ImageIcon size={20} className="mr-2" />
          Photos
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {userProfile.photo_url.map((photoUrl, index) => (
            <div
              key={index}
              className="cursor-pointer relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <AspectRatio ratio={3 / 4}>
                <img
                  src={photoUrl}
                  alt={`Photo ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          ))}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-8">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="info" className="flex gap-2 items-center">
            <User size={16} />
            <span className="hidden sm:inline">Profile Info</span>
          </TabsTrigger>
          <TabsTrigger value="rentals" className="flex gap-2 items-center">
            <Users size={16} />
            <span className="hidden sm:inline">Rental History</span>
          </TabsTrigger>
        </TabsList>

        {/*personal information */}
        <TabsContent value="info">
          <Card>
            <CardHeader className="border-b px-6 py-4">
              <h3 className="text-lg font-medium">Profile Information</h3>
            </CardHeader>
            <CardContent className="divide-y">
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Name</span>
                <span>{userProfile.name}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Age</span>
                <span>{userProfile.age}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Location</span>
                <span>{userProfile.location}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Member Since</span>
                <span>{format((userProfile.created_at) ,"dd/MM/yyyy")}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span>{userProfile.gender}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Interested in</span>
                <span>{userProfile.interested_in}</span>
              </div>
              <div className="py-4 flex justify-between">
                <span className="text-gray-500">Occupation</span>
                <span>{userProfile.occupation}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/*rental table history*/}
        <TabsContent value="rentals">
          <Card>
            <CardHeader className="border-b px-6 py-4">
              <h3 className="text-lg font-medium">Your Rental History</h3>
            </CardHeader>
            {/* <CardContent className="p-6">
              {userProfile.rentalHistory.length > 0 ? (
                <div className="divide-y">
                  {userProfile.rentalHistory.map((rental, index) => (
                    <div
                      key={index}
                      className="py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <Avatar>
                        <img src={rental.profilePicture} />
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{rental.name}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {rental.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1">
                          {rental.service}
                        </Badge>
                        <div className="text-sm font-medium">
                          ${rental.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h4 className="text-gray-500 mb-2">No rental history</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Find a friend to rent
                  </p>
                  <Button>Find Friends</Button>
                </div>
              )}
            </CardContent> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
