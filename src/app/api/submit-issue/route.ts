// import { NextResponse } from 'next/server';
// import { createRouteHandler } from 'uploadthing/next';
 
// import { ourFileRouter } from "../core";
 
// export const  POST  = createRouteHandler ({
 
//   router: ourFileRouter,
//   // return NextResponse.json({message: 'Issue submitted successfully'}),
// })
import { connectToDatabase } from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { ourFileRouter } from '../core'
 
export async function POST(request: Request) {
  // router: connectToDatabase
  router: ourFileRouter
  return NextResponse.json({ message: 'Issue submitted successfully' })
}