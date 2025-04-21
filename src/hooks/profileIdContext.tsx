'use client'

import { createContext, useContext, useState } from 'react'

type UserContextType = {
  profileId: string
  setProfileId: (id: string) => void
}

const UserContext = createContext<UserContextType>({
  profileId: '',
  setProfileId: () => {},
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileId, setProfileId] = useState<string>('')

  //defining the profileid in profileForm
  return (
    <UserContext.Provider value={{ profileId, setProfileId }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
