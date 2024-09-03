"use client"
import { SignIn, SignOutButton, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import React from 'react';

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className='flex items-center justify-center bg-[#fff]'>
      <div className='text-sm '>Dashboard for all logged in users
        <div className='text-lg absolute left-[5rem]'>Welcome to your applaince solutions page!</div>
        <div className='pt-8'>
        <textarea placeholder='Submit appliance Errors and problems here 👇'></textarea>
        </div>
      </div>
      <div className='absolute right-10 top-10'>
        <div className='text-[#000]'>{user?.fullName}</div>
      
      </div>
      <div className='absolute right-2 top-2 overflow-auto'>
        <SignOutButton />
      </div>

    </div>
  )
}

