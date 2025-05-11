

export type profiles = {
    id: string ;
    name: string;
    age: number;
    bio: string;
    interested_in:string;
    avatar:string;
    photo_url:string[];
    gender:string;
    occupation:string;
    location:string;
    interests: string[];
    
  } 

export type rentalRequest = {
  id: string;
  created_at: string;
  user_id: string;
  rentalprofile_id: string;
  metadata: {booking_id: string};
  status: boolean;
  services: string[];
  when: string;
  duration: number;
  message: string;
  profiles: any;

}

export type Review ={
  id: string;
  rentalprofile_id: string;
  user_id: string;
  rating: number;
  created_at: string;
  comment: string;
  profiles:any;
}

export type Notification = {
  id: string;
  created_at: string;
  type: string;
  user_id: string;
  from_user_id: string;
  is_read: boolean;
  metadata: { match_id: string };
  profiles:any;
//   profiles: {
//     name: string ,
//     avatar: string   
// }                        
}
 

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string | boolean;
  match_id: string;
  is_read: boolean;
}

export interface messageProfile {
  id: string;
  name: string | null;
  avatar: string | null;
}

// export interface ChatConversation {
//   id: string;
//   person: {
//     id: string;
//     name: string;
//     profilePicture: string;
//   };
//   lastMessage: string;
//   lastMessageTime: string;
//   unreadCount: number;
//   type: 'date' | 'rental';
//   messages: Message[];
// }

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface RentalProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  location: string;
  language: string;
  bio: string;
  services: string[];
  hourly_rent: number;
  photo_url: string;
  occupation: string;
  profile_id: string;
  availability: boolean;
}
 export interface RentalHistory {
    id: string;
    name: string;
    profilePicture: string;
    date: string;
    service: string;
    amount: number;
  }
  
export interface UserProfile {
    id: string;
    name: string;
    age: number;
    gender: string;
    interested_in: string;
    interests: string[];
    photo_url: string[];
    bio: string;
    avatar: string;
    occupation: string;
    location: string;
    created_at: string;
    rentalHistory: RentalHistory[];
  }