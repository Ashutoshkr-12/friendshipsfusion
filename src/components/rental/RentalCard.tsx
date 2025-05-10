
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { RentalProfile } from '@/lib/types';
import Link from 'next/link';
import { RouteLoader } from '@/components/ui/routerLoader';

interface RentalCardProps {
  profile: RentalProfile;
  
}

const RentalCard: React.FC<RentalCardProps> = ({ profile }) => {
    
  return (
    <RouteLoader href={`/rent-a-friend/${profile.profile_id}`}>
    <Card className="overflow-hidden hover:shadow-lg  transition-shadow">
      <div className="relative h-64 sm:h-76">
        <img 
          src={profile.photo_url[0]} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-sm font-medium text-purple-600">
          ${profile.hourly_rent}/hr
        </div>
      </div>
      <CardContent className="px-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{profile.name}, {profile.age}</h3>
          
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin size={16} />
              <span className="ml-1 text-md">{profile.location}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-2">
          <h4 className="font-medium mb-1">Available for:</h4>
          <div className="flex flex-wrap gap-2">
            {profile.services.map((service, index) => (
              <span key={index} className="bg-purple-100 text-purple-700 px-3 font-semibold py-1 rounded-full text-xs">
                {service}
              </span>
            ))}
          </div>
        </div>
        
        <p className="mt-3 text-gray-600 text-sm line-clamp-2">{profile.bio}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Clock size={16} />
          <span className="ml-1 text-sm">{profile.availability ? <div>
            <span className='text-green-400 text-md'>Online</span>
          </div> : <div>
            <span className='text-red-500 text-md'>Offline</span></div>}</span>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
        >
          Rent Friend
        </Button>
      </CardFooter>
    </Card>
    </RouteLoader>
  );
};

export default RentalCard;