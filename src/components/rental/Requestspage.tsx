'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { rentalRequest } from "@/lib/types";
import dayjs from 'dayjs'
import { Calendar, CheckIcon, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

//action from booking-request page
interface RequestCard {
    request: rentalRequest;
    action: (requestedId: string, action: "accepted" | "rejected") => Promise<void>;
}
const RequestsList: React.FC<RequestCard> = ({ request, action }) => {
    const router = useRouter();
 
    return (
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14 border-2 border-purple-200">
                    <AvatarImage src={request.profiles.avatar} alt='' />
                    <AvatarFallback>{request.profiles.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{request.profiles.name}</h3>
                    <p className="text-sm text-gray-500">sent you a rental request</p>
                  </div>
                </div>
        
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <Calendar size={18} className="mr-2" />
                   <span className="text-sm">Date: {dayjs(request.when).format('D MMMM, YYYY h:mm A')}</span>  
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock size={18} className="mr-2" />
                    <span className="text-sm">Duration: {`${request.duration.toString()} hours`} </span>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-sm">Requested Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.services.map((service, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                          {service.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-300">
                    {request.message && (
                      <>
                        <p className="font-medium mb-1">Message:</p>
                        <p className="italic">{request.message}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className=" p-4 flex justify-between">
                {!request.status && (
                    <>
                     <Button 
                     variant="outline" 
                     onClick={() => action(request.id, 'rejected')}
                     className="w-[48%] border-red-300 hover:bg-red-50 hover:text-red-600"
                   >
                     <X size={18} className="mr-1" /> Reject
                   </Button>
                   <Button 
                       onClick={() => action(request.id, 'accepted')}
                     className="w-[48%] bg-purple-600 hover:bg-purple-700"
                   >
                     <CheckIcon size={18} className="mr-1" /> Accept
                   </Button>
                   </>
                )}
                {request.status && (
                    <>
                     <Button 
                     variant="outline" 
                    onClick={()=> router.push(`/message`)}
                     className="w-full border-red-300 hover:bg-red-50 hover:text-black hover:font-bold"
                   >
                      View chat
                   </Button>
               
                   </>
                )}
               
              </CardFooter>
            </Card>
          );
    
  }


export default RequestsList;