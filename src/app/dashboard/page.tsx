"use client"
import { SignIn, SignOutButton, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { User } from '@clerk/nextjs/dist/types/server';
import React from 'react';
import Upload from './upload/page';

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();

  return (
    <div className='flex items-center justify-center bg-[#fff]'>
      <div className='text-sm '>Dashboard for all logged in users
        <div className='text-2xl text-sky-950 absolute left-[3rem] overflow-auto'>Welcome to your applaince solutions page!</div>
        <div className='pt-8 w-max'>
        <textarea placeholder='Submit appliance Errors and problems here 👇' className='w-[23rem] '></textarea>
        </div>
      </div>
      <div className='absolute right-8 top-10'>
        <div className='text-[#246e2b]'>Over 100 years of appliance repair experience at your finger tips</div>
     
      </div>
      <div className='absolute right-2 top-2 overflow-auto'>
       
        <SignOutButton />
      </div>
      
    </div>
  )
}

