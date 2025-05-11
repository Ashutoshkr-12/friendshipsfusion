"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center select-none">
      <div className="border-b-2 ">
        <Image
          
          src="/friendshipfusionlogo.png"
          alt="friendship/fusion"
          width={300}
          height={30}
          priority
        />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold">
        Welcome to Friendship Fusion
      </h1>
      <p className="text-md md:text-lg text-center mt-4 max-w-lg">
        Looking for love or just someone to hang out with? <br />
        <span className="text-indigo-700 font-bold">
          Friendship Fusion
        </span>
        lets you connect with like-minded people for dating, meaningful
        friendships, or even a fun companion for the day.
      </p>
      <p className="text-md md:text-lg text-center max-w-lg  mt-4">
        Need a friend for an event, travel, or just a great conversation? With
        our <span className="font-bold text-indigo-700">Rent a Friend</span>
        feature, you can find friendly, verified companions to share experiences
        without any pressure—just good company on your terms!
      </p>

      <AlertDialog>
        <AlertDialogTrigger className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Create your profile
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please follow these house rules</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="py-1 text-md flex gap-x-1.5">
                <ArrowBigRight />
                Make sure your photo, age, bio are accurate to who you are.
              </span>
              <span className="py-1 text-md flex gap-x-1.5">
                <ArrowBigRight />
                Don't be too quick to give out your personal information.
              </span>
              <span className="py-1 text-md flex gap-x-1.5">
                <ArrowBigRight />
                Respect others and treat them as you would like to be treated.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className=" w-full flex items-center justify-center">
              <Link href={`/profile-form`}>
                <AlertDialogAction>Continue</AlertDialogAction>
              </Link>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
