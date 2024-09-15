import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { UTApi } from 'uploadthing/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const utapi = new UTApi();

if(!uri){
  throw new Error( 'Please add your MongoDB uri to .env.local');
}


let client: MongoClient | null = null;

if(!client) {
  client = new MongoClient(uri);
}

interface SubmitIssueRequestBody {
  textContent: string;
  files?: File[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    console.log('Extracted userId:', userId);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { textContent, files } = req.body as SubmitIssueRequestBody;

    if (!client) {
      client = new MongoClient(uri as string);
      await client.connect();
    }

    const db = client.db('WAC');

    const issues = db.collection('issues');

    let fileUrls: string[] = [];

   

    if (files && Array.isArray(files) && files.length > 0 ) {
      const uploadPromises = files.map(async (file) => {
      try {
        const uploadedFile = await utapi.uploadFiles(file);
        if (uploadedFile.error){
          console.error(`Error uploading file: ${uploadedFile.error.message}`)
          return null;

        }
        return uploadedFile.data?.url;
      } catch (error) {
        console.error('Error uploading file:', error);
        return null;
      }
    });

    const uploadResults = await Promise.all(uploadPromises);
    fileUrls = uploadResults.filter((url): url is string => url !== null);
  }

  const result = await issues.insertOne({
    userId,
    textContent,
    fileUrls,
    createdAt: new Date()
  });

  console.log('Saved to MongoDB:', result.insertedId);

    res.status(200).json({ message: 'Issue submitted successfully' });
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}