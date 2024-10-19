
import { connectToDatabase } from '@/lib/mongodb';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { ourFileRouter } from '../core';
 
export async function POST(request: NextRequest) {
  console.log('API route /api/submit-issue hit:', new Date().toISOString());
  // router: connectToDatabase
  // router: ourFileRouter
  //post to AI agent with n8n workflow
  try {
    const {db} = await connectToDatabase();
    console.log('Connected to MongoDB');

    const { userId } = getAuth( request );
    console.log('Extracted userId:', userId);
    if (!userId) {
      console.log('No userId found. Returning unauthorized.');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }



    const body = await request.json();
    console.log('Recieved request body from route.ts:', body );

    const { textContent, files } = body;

    const issues = db.collection('ImCounsulting');
    console.log('Accessing collection: ApplianceDocs');

    let fileUrls: string[] = [];
     
    if (files && Array.isArray(files) && files.length > 0) {
      fileUrls = files.map(file => file.url).filter(Boolean);
      console.log('Processed file URLs:', fileUrls);
    }

    const documentToInsert = {
      userId,
      textContent,
      fileUrls,
      createdAt: new Date()
    };
    console.log('Attempting to insert document:', documentToInsert);

    const result = await issues.insertOne(documentToInsert);
    console.log('Insertion result:', result);

    if (result.acknowledged) {
      console.log('Document inserted successfully. ID:', result.insertedId);
      return NextResponse.json({ message: 'Issue submitted successfully', issueId: result.insertedId });
    } else {
      console.log('Document insertion failed.');
      return NextResponse.json({ message: 'Failed to insert document' }, { status: 500 });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}
