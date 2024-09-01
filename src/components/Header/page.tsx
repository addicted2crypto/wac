import { SignIn, SignUp } from '@clerk/nextjs'
import {  clerkClient } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'
import WidthWrapper from '../ui/Widthwrapper'





const Navbar = () => {
  const  userId  = 'user_123';
  const response =  clerkClient?.users.getUser(userId);
  console.log(response);
  if(userId){
    console.log(userId);
  }
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