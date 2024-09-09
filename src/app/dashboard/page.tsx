"use client"
import { Button } from '@/components/ui/button';
import { SignIn, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';


export default function Dashboard() {
  const {  user } = useUser();
  

  if(!user) {
    return null;
  }
  
  
  return (
    
    <div className='min-h-screen bg-[#fff]'>
      <SignedIn>
      <div className='max-w-4xl mx-auto '>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl text-sky-950 absolute left-[3rem] overflow-auto'>Welcome to your applaince solutions page!</h1>
        
        </div>
        <div className='absolute top-6 right-6'>
        <SignOutButton />
        </div>
        <div className='bg-[#606060] p-6 rounded-lg shadow-md'>
          <h2 className='bg-gray-100 p-6 rounded-lg shadow-md'>Submit Appliance Issues</h2>
          <textarea
            placeholder='Describe your appliance errors and problems here...'
            className='w-full p-2 border border-gray-300 rounded-md'
            rows={6}
            ></textarea>
            <Button variant='outline'>Submit
            </Button>
        </div>
        {/* <div className='pt-8 w-max'>
        <textarea placeholder='Submit appliance Errors and problems here 👇' className='w-[23rem] '></textarea>
        </div> */}
      </div>
      <div className='mt-8 text-center text-[#101010]'>
        <p className=' font-serif text-3xl'>Over 100 years of appliance repair experience at your finger tips</p>
     
      </div>
      </SignedIn>
      </div>
  );
      }
      
      {/* <div className='absolute right-2 top-2 overflow-auto'>
       
        <SignOutButton />
      </div>
      </SignedIn>

      <SignedOut>
        <div className='flex items-end justify-end min-h-screen'>
          <div className='text-end'>
            <div className='text-2xl mb-4'>
          Please to access the dashboard.
        </div>
        <SignIn />
        </div>
        </div>
      </SignedOut>
    </div> */}
   
    
  

