'use client'; // 👈 THIS LINE IS THE FIX

import { FaEye } from "react-icons/fa";
import { resetPassword } from '@/serverActions/authAction'; // adjust path if needed
import { useState } from 'react';
import { useSearchParams } from "next/navigation";


export default function ResetPassword() {

  const searchParams = useSearchParams();
  const searchParam = searchParams.get('message');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = searchParam ? searchParam : '';

    try {
      await resetPassword(code, formData);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };
    const [toggle,setToggle] = useState(false);
  
    const handleToggle=()=>{
      setToggle(!toggle)
    }

  return (
    <div className='w-full h-screen flex flex-col justify-center bg-[#c59fdb] '>
      <div className="sm:max-w-md w-2xl min-h-fit p-10 py-16 rounded-md shadow-2xl mx-auto select-none">
        <form
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground mb-4"
          onSubmit={handleSubmit}
        >
          <label className="text-md" htmlFor="password">
            New Password
          </label>
          <div className="flex justify-end w-full items-center">
          <input
            className="rounded-md  bg-inherit w-full py-2 px-4 border "
            type={toggle? 'text' : 'password'}
            name="password"
            placeholder="••••••••"
            required
          />
          <FaEye className="text-2xl absolute " onClick={handleToggle}/>
          </div>
          <label className="text-md mt-4" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required
          />

          <button className="bg-indigo-700 rounded-md px-4 py-2 text-foreground mb-2">
            Reset
          </button>

          {searchParam && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParam}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
