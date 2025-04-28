
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Avatar } from '@/components/ui/avatar';
// import { Star, MapPin, Clock } from 'lucide-react';
// import { RentalProfile } from '@/lib/types';

// interface RentalCardProps {
//   profile: RentalProfile;
//   onRent: (profile: RentalProfile) => void;
// }

// const RentalCard: React.FC<RentalCardProps> = ({ profile, onRent }) => {
//   return (
//     <Card className="overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="relative h-48">
//         <img 
//           src={profile.profilePicture} 
//           alt={profile.name}
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-sm font-medium text-purple-600">
//           ${profile.hourlyRate}/hr
//         </div>
//       </div>
//       <CardContent className="p-4">
//         <div className="flex items-start justify-between">
//           <div>
//             <h3 className="text-lg font-bold">{profile.name}, {profile.age}</h3>
//             <div className="flex items-center text-yellow-500 mt-1">
//               <Star size={16} className="fill-yellow-500" />
//               <span className="ml-1 text-sm">{profile.rating} ({profile.reviewCount})</span>
//             </div>
//             <div className="flex items-center text-gray-500 mt-1">
//               <MapPin size={16} />
//               <span className="ml-1 text-sm">{profile.location}</span>
//             </div>
//           </div>
//           <Avatar src={profile.profilePicture} alt={profile.name} className="h-12 w-12 border-2 border-purple-200" />
//         </div>
        
//         <div className="mt-3">
//           <h4 className="font-medium mb-1">Available for:</h4>
//           <div className="flex flex-wrap gap-2">
//             {profile.services.map((service, index) => (
//               <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
//                 {service}
//               </span>
//             ))}
//           </div>
//         </div>
        
//         <p className="mt-3 text-gray-600 text-sm line-clamp-2">{profile.bio}</p>
//       </CardContent>
//       <CardFooter className="p-4 pt-0 flex justify-between items-center">
//         <div className="flex items-center text-gray-500">
//           <Clock size={16} />
//           <span className="ml-1 text-sm">{profile.availability}</span>
//         </div>
//         <Button 
//           onClick={() => onRent(profile)}
//           className="bg-purple-600 hover:bg-purple-700"
//         >
//           Rent Friend
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default RentalCard;