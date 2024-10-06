
import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ourFileRouter } from '../core';
 
export async function POST(request: Request) {
  console.log('API route /api/submit-issue hit:', new Date().toISOString());
  // router: connectToDatabase
  // router: ourFileRouter
  try {
    const {db} = await connectToDatabase();
    console.log('Connected to MongoDB');

    const body = await request.json();
    console.log('Recieved request body:', body );

    const { textContent, files } = body;

    const issues = db.collection('ApplianceDocs');
    console.log('Accessing collection: ApplianceDocs');

    let fileUrls: string[] = [];
     
    if (files && Array.isArray(files) && files.length > 0) {
      fileUrls = files.map(file => file.url).filter(Boolean);
      console.log('Processed file URLs:', fileUrls);
    }

    const documentToInsert = {
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
//   }
//   return NextResponse.json({ message: 'Issue submitted successfully' })
// }