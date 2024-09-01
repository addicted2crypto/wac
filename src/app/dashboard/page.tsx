"use client"
import { SignIn, SignOutButton, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import React from 'react';

export default function Dashboard() {
  const {isSignedIn, user, isLoaded } = useUser()
    if(!isLoaded){
      return <SignIn />
    } else {
  return (
    <div className='flex flex-auto'>
    <div className='text-sm'>Dashboard for all logged in users
      <div className='text-lg justify-center items-center'>Welcome {user?.fullName}<UserButton /></div>

    </div>
    <SignOutButton />
    </div>
  )
}
}
