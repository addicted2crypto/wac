import { SignIn, SignUp, useAuth } from '@clerk/nextjs';
import {  clerkClient } from '@clerk/nextjs/server';

import Link from 'next/link';
import React from 'react';
import WidthWrapper from '../ui/Widthwrapper';




const Navbar = ()  => {
  // const {isLoaded, userId, sessionId, getToken } = useAuth();
  // console.log(userId, sessionId, getToken, isLoaded);
  const  userId  = 'users_111';
  const response =  clerkClient.users.getUser(userId);

  // if(userId){
  //   console.log(userId);
  // }
  return (
     
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/60 backdrop-blur-lg transition-all">
          <WidthWrapper>
              <div className="flex h-14 items-center justify-between border-b border-zinc-900">
                  <Link href="/" className="flex z-40 font-semibold">
                      <span>WAC</span>
                      
                    {/*add logo */}
                  </Link>
                  <div className="hidden items-center space-x-4 sm:flex hover:bg-slate-300">
                      {!userId ? (
                          <>
                      
                      <Link href="/price"className='sm'
                          // variant: "ghost",
                          // size: "sm"
                      >Price
                      </Link>
                      <Link href="/sign-in"
                      className='text:sm'
                          // variant: "ghost",
                          // size: "sm",
                      >
                          Sign in
                          <SignIn />
                          <SignUp/>
                     
                          Schedule APT
                     
                      </Link>
                      </>
                      ) : (
                          <Link 
                           href='././dashboard'
                           className='text-sm'>Dashboard</Link>
                          
                          
                           
                      )}  
                  </div>
              </div>
          </WidthWrapper>
      </nav>
  )
}

export default Navbar