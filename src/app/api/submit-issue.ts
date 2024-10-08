import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { UTApi } from 'uploadthing/server';
import { MongoClient } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';


// const uri = process.env.MONGODB_URI;
// const utapi = new UTApi();

// if(!uri){
//   throw new Error( 'Please add your MongoDB uri to .env.local');
// }


// const client = new MongoClient(uri);

// if(!client) {
//   client = new MongoClient(uri);
// }

interface SubmitIssueRequestBody {
  textContent: string;
  files?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[]; 
}

export  async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    
    const {db} = await connectToDatabase();
    // const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');
    // const issues = client.db('ApplianceDocs')
    const { userId } = getAuth(req);
    console.log('Extracted userId:', userId);
      
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { textContent, files } = req.body as SubmitIssueRequestBody;
    console.log('Request body: ', { textContent, files });
    // if (!client) {
    //   client = new MongoClient(uri as string);
    //   await client.connect();
    // }

    const issues = db.collection('ApplianceDocs');  /* db name */


    let fileUrls: string[] = [];

   

    if (files && Array.isArray(files) && files.length > 0 ) {
      fileUrls = files.map(file => file.url).filter(Boolean) 
    }
      
     
        const result = await issues.insertOne({
          userId,
          textContent,
          fileUrls,
          createdAt: new Date()
        });

        console.log('Saved to MongoDb', result.insertedId);
    

 
    return res.status(200).json({ message: 'Issue submitted successfully'})
  } catch (error) {
    console.error('API route error :', error);
    // res.status(500).json({ message: 'Internal server error' });
    return res.status(500).json({ message: 'Internal server error'})
  } 
}