
export type profiles = {
    id: string;
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

export type Notification = {
  id: string;
  created_at: string;
  type: string;
  user_id: string;
  from_user_id: string;
  is_read: boolean;
  profiles:{
    name: string;
    avatar: string;
  }
}
  
  export interface RentalProfile {
    id: string;
    name: string;
    age: number;
    bio: string;
    profilePicture: string;
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    location: string;
    services: string[];
    availability: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    timestamp: string;
    fromMe: boolean;
  }
  
  export interface ChatConversation {
    id: string;
    person: {
      id: string;
      name: string;
      profilePicture: string;
    };
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    type: 'date' | 'rental';
    messages: Message[];
  }
  
  export interface Match {
    id: string;
    name: string;
    age: number;
    profilePicture: string;
    matchDate: string;
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