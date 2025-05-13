'use server'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout/applayout";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function Rules(){
return(
    
    <AppLayout>
    <div className="w-full flex flex-col select-none items-center h-screen py-6 px-3">
          <div className="sm:mx-auto sm:w-full border-b mb-4 sm:max-w-sm ">
                  <Image
                    className="mx-auto mb-3 filter brightness-200"
                    src="/friendshipfusionlogo.png"
                    alt="friendship/fusion"
                    width={280}
                    height={35}
                    priority
                  />
                   <h2 className="text-xl font-semibold mb-2 brightness-200">🚨 Rent a Friend - Rules & Disclaimer</h2>
                </div>
   <section className=" border border-blue-400 rounded-xl p-4 mb-6">
          <ul className="list-disc text-lg list-inside space-y-1">
            <li>This service is strictly for social companionship purposes only.</li>
            <li>Respect and consent are mandatory — any inappropriate behavior will lead to a permanent ban.</li>
            <li>Friends are not obligated to continue interactions beyond the agreed time.</li>
            <li>Payments must be completed before accessing friend profiles.</li>
            <li>No refunds after a session has started.</li>
          </ul>
        </section>
            <Dialog>
                <DialogTrigger asChild>
          <div className="mt-4 w-full flex justify-center">
            <Button>Get premium membership</Button>
          </div>
          </DialogTrigger>
          <DialogContent className="w-full min-h-fit select-none flex flex-col items-start justify-center">
           
            <div className="min-h-fit flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 space-y-4">
            <DialogTitle  className="text-2xl font-bold text-center text-yellow-700">
          
            🚀 Unlock Premium Access
         
          </DialogTitle>

          <p className="text-center text-lg text-gray-300">
            See who wants to connect with you, rent a friend instantly, or start earning by creating your own profile.
          </p>
            <Link href={'/checkout'}>
          <div className="flex justify-center">
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
            >
              💳 Proceed to Payment
            </Button>
          </div>
            </Link>
        </CardContent>
      </Card>
            </div>
         
          </DialogContent>
          </Dialog>
        </div>

        </AppLayout>
   
   
)

};