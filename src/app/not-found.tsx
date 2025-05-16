'use client'
import { Button } from "@/components/ui/button";
import { Heart, HeartCrack } from "lucide-react";
import { useRouter } from "next/navigation";


const NotFound = () => {
const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="relative w-full max-w-sm mx-auto">
        {/* Animated hearts background */}
        <div className="absolute -top-5 -left-10 animate-pulse">
          <Heart size={32} color="#d946ef" opacity={0.2} />
        </div>
        <div className="absolute top-20 right-10 animate-pulse delay-300">
          <Heart size={24} color="#d946ef" opacity={0.2} />
        </div>
        <div className="absolute bottom-10 left-20 animate-pulse delay-700">
          <Heart size={28} color="#d946ef" opacity={0.2} />
        </div>
      </div>
      
      <div className="relative z-10 bg-white/80 backdrop-blur-sm p-10 rounded-xl shadow-xl border border-pink-100 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <HeartCrack size={80} className="text-pink-500" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">Missed Connection</h1>
        <p className="text-xl text-gray-700 mb-6">
         Unable to load the page
        </p>
    
        <div className="text-gray-500 mb-8">
          <p className="text-sm">It might be taking a break or a refresh.</p>
        </div>
        
        <Button
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 px-8 py-6 h-auto text-lg font-medium"
          onClick={() => router.back()}
        >
         Refresh the page
        </Button>
      </div>
      
      <div className="mt-8 text-sm text-purple-400">
        Error 404 | Page Not Found
      </div>
    </div>
  );
};

export default NotFound;