import ProfileInputForm from '@/components/usersInput/ProfileForm'
import { ModeToggle } from '@/components/ui/themeToggle'
import React from 'react'

function profileForm() {
  return (
    <div className='px-2'>
            <div className='flex justify-end '>
              <div className='absolute p-5'>
            <ModeToggle/>
            </div>
            </div>
            <div><ProfileInputForm/></div>
          </div>
    
  )
}

export default profileForm