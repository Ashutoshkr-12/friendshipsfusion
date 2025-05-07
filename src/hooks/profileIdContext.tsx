'use client'
import { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import { userdata } from '@/hooks/userdata'


type UserContextType = {
  profileId: string
}

const UserContext = createContext<UserContextType>({
  profileId: 'some-id',
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileId, setProfileId] = useState<string>('')

  useEffect(() => {
    const fetchuserId = async () => {
      const user = await userdata();
     // console.log(user);
     const profileid = user?.profileId?.[0]?.id || ''; // Extract the first id or use an empty string
     // console.log(profileid)
     localStorage.setItem('profileId', profileid);
      setProfileId(profileid);
    };
    fetchuserId();
  }, [userdata]);
  //defining the profileid in profileForm
  return (
    <UserContext.Provider value={{ profileId }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
