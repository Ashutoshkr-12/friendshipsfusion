
import { profiles, RentalProfile, ChatConversation, UserProfile } from '@/lib/types';

// Dating profiles for swiping

export const datingProfiles: profiles[] = [
  {
    id: '1',
    name: 'Sophia',
    age: 27,
    gender:'male',
    bio: 'Passionate about photography, travel, and trying new foods. Looking for someone to explore the city with!',
    location:'delhi,india',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    interests: ['Photography', 'Travel', 'Food', 'Hiking'],
    interested_in:'female',
    occupation: 'halwai',
    photo_url:['https://images.unsplash.com/photo-1742302954292-1f903368084e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
   
  },
  {
    id: '2',
    name: 'James',
    age: 29,
    gender:'male',
    occupation: 'halwai',
    location:'delhi,india',
    bio: 'Software engineer by day, musician by night. Coffee enthusiast and animal lover.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
    interests: ['Music', 'Coding', 'Coffee', 'Pets'],
    interested_in:'female',
    photo_url:['https://images.unsplash.com/photo-1742302954292-1f903368084e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D']
  },
  {
    id: '3',
    name: 'Emma',
    age: 24,
    gender:'male',
    location:'delhi,india',
    bio: 'Art student and part-time yoga instructor. Looking for genuine connections and deep conversations.',
    avatar: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1888&auto=format&fit=crop',
    interests: ['Art', 'Yoga', 'Reading', 'Philosophy'],
    interested_in:'female',
    photo_url:['https://images.unsplash.com/photo-1742302954292-1f903368084e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    occupation: 'halwai',
  },
  {
    id: '4',
    name: 'Michael',
    age: 31,
    location:'delhi,india',
    gender:'male',
    bio: 'Fitness trainer and nutrition coach. I enjoy outdoor activities and challenging myself to try new things.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    interested_in:'female',
    photo_url:['https://images.unsplash.com/photo-1742302954292-1f903368084e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    occupation: 'halwai',
    interests: ['Fitness', 'Nutrition', 'Outdoors', 'Adventure'],
    },
  {
    id: '5',
    name: 'Olivia',
    gender:'male',
    age: 26,
    location:'delhi,india',
    bio: 'Digital nomad working in marketing. I love exploring new places, taking photos, and finding hidden gems.',
    avatar: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?q=80&w=1964&auto=format&fit=crop',
    interested_in:'female',
    photo_url:['https://images.unsplash.com/photo-1742302954292-1f903368084e?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
   occupation: 'halwai',
    interests: ['Travel', 'Photography', 'Marketing', 'Food'],
  
  }
];

//Rental friend profiles
export const rentalProfiles: RentalProfile[] = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    bio: 'Friendly, outgoing, and always up for an adventure. I can be your tour guide, shopping companion, or just someone to chat with over coffee.',
    profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop',
    hourlyRate: 35,
    rating: 4.8,
    reviewCount: 127,
    location: 'New York, NY',
    services: ['City Tour', 'Shopping', 'Coffee Date', 'Museum Visit'],
    availability: 'Weekdays & Weekends'
  },
  {
    id: '2',
    name: 'Mia',
    age: 25,
    bio: 'Professional photographer and art enthusiast. I can help you take amazing photos or guide you through the best art galleries in town.',
    profilePicture: 'https://images.unsplash.com/photo-1469460340997-2f854421e72f?q=80&w=1974&auto=format&fit=crop',
    hourlyRate: 45,
    rating: 4.9,
    reviewCount: 89,
    location: 'Los Angeles, CA',
    services: ['Photography', 'Art Gallery Tour', 'Sightseeing', 'Events'],
    availability: 'Weekends Only'
  },
  {
    id: '3',
    name: 'Daniel',
    age: 30,
    bio: 'Foodie and culinary expert. Let me take you on a gastronomic tour or accompany you to a restaurant you\'ve been wanting to try.',
    profilePicture: 'https://images.unsplash.com/photo-1497316730643-415fac54a2af?q=80&w=1964&auto=format&fit=crop',
    hourlyRate: 40,
    rating: 4.7,
    reviewCount: 104,
    location: 'Chicago, IL',
    services: ['Food Tour', 'Restaurant Companion', 'Cooking Class', 'Coffee Date'],
    availability: 'Evenings & Weekends'
  },
  {
    id: '4',
    name: 'Lily',
    age: 26,
    bio: 'Fitness coach and outdoor enthusiast. Join me for a workout session, hiking trip, or any outdoor activity you enjoy.',
    profilePicture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974&auto=format&fit=crop',
    hourlyRate: 50,
    rating: 4.9,
    reviewCount: 76,
    location: 'Denver, CO',
    services: ['Hiking', 'Workout Buddy', 'Running', 'Outdoor Activities'],
    availability: 'Flexible Schedule'
  },
  {
    id: '5',
    name: 'Jake',
    age: 29,
    bio: 'Local musician and nightlife connoisseur. I can show you the best music venues, bars, and clubs in the city.',
    profilePicture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=2048&auto=format&fit=crop',
    hourlyRate: 40,
    rating: 4.6,
    reviewCount: 92,
    location: 'Nashville, TN',
    services: ['Nightlife Tour', 'Concert Buddy', 'Bar Hopping', 'Music Events'],
    availability: 'Evenings & Weekends'
  },
  {
    id: '6',
    name: 'Nina',
    age: 27,
    bio: 'Yoga instructor and wellness coach. Let\'s practice yoga together or have a mindful day focusing on wellness.',
    profilePicture: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1989&auto=format&fit=crop',
    hourlyRate: 55,
    rating: 4.9,
    reviewCount: 68,
    location: 'San Francisco, CA',
    services: ['Yoga Session', 'Meditation', 'Wellness Activities', 'Nature Walks'],
    availability: 'Mornings & Weekends'
  }
];

//Chat conversations
export const chatConversations: ChatConversation[] = [
  {
    id: '1',
    person: {
      id: '1',
      name: 'Sophia',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop'
    },
    lastMessage: 'I\'d love to check out that new restaurant this weekend!',
    lastMessageTime: '2023-06-10T14:30:00Z',
    unreadCount: 2,
    type: 'date',
    messages: [
      {
        id: '1a',
        content: 'Hey, I really enjoyed talking with you on the app!',
        timestamp: '2023-06-10T12:00:00Z',
        fromMe: false
      },
      {
        id: '1b',
        content: 'Thanks! I enjoyed our conversation too. Do you have any plans for the weekend?',
        timestamp: '2023-06-10T12:05:00Z',
        fromMe: true
      },
      {
        id: '1c',
        content: 'Not yet! I was thinking about trying that new restaurant downtown. Have you been there?',
        timestamp: '2023-06-10T12:10:00Z',
        fromMe: false
      },
      {
        id: '1d',
        content: 'No, I haven\'t but I\'ve heard great things about it. Would you like to go together?',
        timestamp: '2023-06-10T12:15:00Z',
        fromMe: true
      },
      {
        id: '1e',
        content: 'I\'d love to check out that new restaurant this weekend!',
        timestamp: '2023-06-10T14:30:00Z',
        fromMe: false
      }
    ]
  },
  {
    id: '2',
    person: {
      id: '1',
      name: 'Alex',
      profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop'
    },
    lastMessage: 'I\'m free this Friday for the city tour. Shall we meet at 2pm?',
    lastMessageTime: '2023-06-09T18:45:00Z',
    unreadCount: 0,
    type: 'rental',
    messages: [
      {
        id: '2a',
        content: 'Hi, I saw your profile and I\'m interested in the city tour service.',
        timestamp: '2023-06-09T16:00:00Z',
        fromMe: true
      },
      {
        id: '2b',
        content: 'Hi there! I\'d be happy to show you around the city. What areas are you most interested in visiting?',
        timestamp: '2023-06-09T16:10:00Z',
        fromMe: false
      },
      {
        id: '2c',
        content: 'I\'m particularly interested in historical sites and local food spots that tourists might not know about.',
        timestamp: '2023-06-09T16:20:00Z',
        fromMe: true
      },
      {
        id: '2d',
        content: 'Perfect! I know several hidden gems that would be perfect for you. When would you like to schedule the tour?',
        timestamp: '2023-06-09T16:30:00Z',
        fromMe: false
      },
      {
        id: '2e',
        content: 'I\'m free this Friday for the city tour. Shall we meet at 2pm?',
        timestamp: '2023-06-09T18:45:00Z',
        fromMe: false
      }
    ]
  },
  {
    id: '3',
    person: {
      id: '3',
      name: 'Emma',
      profilePicture: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=1888&auto=format&fit=crop'
    },
    lastMessage: 'I\'d love to hear more about your favorite books sometime.',
    lastMessageTime: '2023-06-08T21:15:00Z',
    unreadCount: 0,
    type: 'date',
    messages: [
      {
        id: '3a',
        content: 'I noticed you like reading philosophy. What are some of your favorite books?',
        timestamp: '2023-06-08T20:00:00Z',
        fromMe: true
      },
      {
        id: '3b',
        content: 'I love Meditations by Marcus Aurelius and anything by Simone de Beauvoir. How about you?',
        timestamp: '2023-06-08T20:10:00Z',
        fromMe: false
      },
      {
        id: '3c',
        content: 'Those are great choices! I\'m a fan of Camus and Sartre myself. Existentialism is fascinating.',
        timestamp: '2023-06-08T20:20:00Z',
        fromMe: true
      },
      {
        id: '3d',
        content: 'I\'d love to hear more about your favorite books sometime.',
        timestamp: '2023-06-08T21:15:00Z',
        fromMe: false
      }
    ]
  },
  {
    id: '4',
    person: {
      id: '4',
      name: 'Lily',
      profilePicture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974&auto=format&fit=crop'
    },
    lastMessage: 'The hiking trail was amazing! Thanks for being such a great guide.',
    lastMessageTime: '2023-06-07T19:30:00Z',
    unreadCount: 0,
    type: 'rental',
    messages: [
      {
        id: '4a',
        content: 'Hey Lily, I just booked you for the hiking trip this Saturday.',
        timestamp: '2023-06-06T10:00:00Z',
        fromMe: true
      },
      {
        id: '4b',
        content: 'Great! I\'m looking forward to it. The trail I have in mind has some amazing views.',
        timestamp: '2023-06-06T10:15:00Z',
        fromMe: false
      },
      {
        id: '4c',
        content: 'Sounds perfect. What should I bring with me?',
        timestamp: '2023-06-06T10:30:00Z',
        fromMe: true
      },
      {
        id: '4d',
        content: 'Just comfortable shoes, water, and maybe a light snack. I\'ll take care of everything else!',
        timestamp: '2023-06-06T10:45:00Z',
        fromMe: false
      },
      {
        id: '4e',
        content: 'The hiking trail was amazing! Thanks for being such a great guide.',
        timestamp: '2023-06-07T19:30:00Z',
        fromMe: true
      }
    ]
  }
];

//user profile
export const currentUserProfile: UserProfile = {
    id: 'current-user',
    name: 'Jamie Smith',
    age: 28,
    occupation: 'doctor',
    bio: 'Travel enthusiast, coffee addict, and amateur photographer. Looking for both new friends and potential dates who enjoy exploring the world and trying new experiences.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop',
    location: 'Seattle, WA',
    photo_url: ['https://thumbs.dreamstime.com/b/simple-indian-girl-sweet-smile-happy-face-44021920.jpg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Quz667dN8Z0imZYdhWLFMz2DUKN8ulU_kQ&s'],
    memberSince: 'January 2023',
    gender: 'male',
    interested_in: 'female',
    interests: ['Travel', 'Photography', 'Coffee', 'Hiking', 'Movies', 'Food'],
    rentalHistory: [
      {
        id: '1',
        name: 'Alex',
        profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop',
        date: 'June 10, 2023',
        service: 'City Tour',
        amount: 70.00
      },
      {
        id: '4',
        name: 'Lily',
        profilePicture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1974&auto=format&fit=crop',
        date: 'June 7, 2023',
        service: 'Hiking Trip',
        amount: 100.00
      }
    ]
  };