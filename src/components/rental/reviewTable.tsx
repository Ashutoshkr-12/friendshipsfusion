"use client";
import { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, SquarePen, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/profileIdContext";
import { supabase } from "@/utils/supabase/supabase";
import { Review } from "@/lib/types";

export default function Reviewpage({
  rental_id,
  data,
}: {
  rental_id: string;
  data: Review[];
}) {
  const [open, setOpen] = useState(false);
  const { profileId } = useUser();
  const [review, setReview] = useState<string>();
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState(0);

  //stars
  const handleClick = (value: number) => {
    setRating(value);
    // onChange(value) // Removed or commented out as onChange is not defined
  };

  //reviews
  const handleReview = async () => {
    //console.log(review, rating);
    try {
      const { error: reviewInsertError } = await supabase
        .from("reviews")
        .insert({
          rentalprofile_id: rental_id,
          user_id: profileId,
          rating,
          comment: review,
        });

      if (reviewInsertError) {
        console.error("error in inserting review:", reviewInsertError.message);
      }
    } catch (error) {
      console.error("Error in review insertion:", error);
    }
    setOpen(false);
  };

  return (
    <Card className="mt-6 ">
      <CardHeader>
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="flex justify-end items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className=" ">
                <SquarePen />
                write a review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl tracking-tight border-b-2 pb-2">
                  Share your experience
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="flex items-center justify-start text-yellow-500">
                  <h1 className="text-xl text-white px-4">Rating</h1>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        size={24}
                        className={`cursor-pointer ${
                          (hover || rating) >= value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => handleClick(value)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <textarea
                    rows={3}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Share details of your experience with them."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleReview}>Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data?.length === 0 ? (
            <>
              <div className="w-full flex items-center justify-center py-2">
                <span className="text-xl font-semibold">No review yet</span>
              </div>
            </>
          ) : (
            <>
              {data.map((data, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{data.profiles.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{data.profiles.name}</div>
                      <div className="text-sm text-gray-500">
                        <Calendar size={14} className="inline mr-1" />
                        {formatDistanceToNow(parseISO(data.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${
                            i < data.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 px-2 text-md">{data.comment}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
