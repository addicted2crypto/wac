import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { UTApi } from 'uploadthing/server';
import { MongoClient } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';


const uri = process.env.MONGODB_URI;
const utapi = new UTApi();

if(!uri){
  throw new Error( 'Please add your MongoDB uri to .env.local');
}


const client = new MongoClient(uri);

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
    
    
    await connectToDatabase();
    // const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');
    // const issues = client.db('ApplianceDocs')
    const { userId } = getAuth(req);
    console.log('Extracted userId:', userId);
      
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { textContent, files } = await req.body as SubmitIssueRequestBody;
    console.log('Request body: ', { textContent, files });
    // if (!client) {
    //   client = new MongoClient(uri as string);
    //   await client.connect();
    // }

    const db = client.db('Appliance_Consult');  /* db name */

    const issues = db.collection('Im_Counsulting');  /* collection name */

    let fileUrls: string[] = [];

   

    if (files && Array.isArray(files) && files.length > 0 ) {
      fileUrls = files.map(file => file.url).filter(Boolean) 
    }
      
      // try {
      //   const fileBob = new Blob([file.data], { type: file.type});
      //   const fileEsque = new File([fileBob], file.name, { type: file.type})

      //   const uploadedFile = await utapi.uploadFiles([fileEsque]);
        
        // if (uploadedFile.error ){
        //   console.error('File upload failed: No URL returned');
        //   return null;

        // }
        const result = await issues.insertOne({
          userId,
          textContent,
          fileUrls,
          createdAt: new Date()
        });

        console.log('Saved to MongoDb', result.insertedId);
      //   return uploadedFile[0].data?.url || null;
      // } catch (error) {
      //   console.error('Error uploading file:', error);
      //   return null;
      // }
    // });

  //   const uploadResults = await Promise.all(uploadPromises);
  //   fileUrls = uploadResults.filter((url): url is string => url !== null);
  // }

  // const result = await issues.insertOne({
  //   userId,
  //   textContent,
  //   fileUrls,
  //   createdAt: new Date()
  // });

  // console.log('Saved to MongoDB:', result.insertedId);

    // res.status(200).json({ message: 'Issue submitted successfully' });
    return res.status(200).json({ message: 'Issue submitted successfully'})
  } catch (error) {
    console.error('API route error:', error);
    // res.status(500).json({ message: 'Internal server error' });
    return res.status(500).json({ message: 'Internal server error'})
  } finally {
    await client.close();
    console.log('Disconnected from MongoDb');
  }
}