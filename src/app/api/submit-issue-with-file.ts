// api/upload-issue-with-files.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';


if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}


const url: string = process.env.MONGODB_URI;

const dbName = process.env.DB_NAME;


// const uploadFiles = async (files: File[])=> {
//   const fileUrls = await Promise.all(files.map(async (file) => {
//     try {
//     const result = await start(file);
//     return result.url;
//   } catch (error){
//     console.error('Error uploading file:', error);
//     throw error;
//   }
//   }));
//   return fileUrls;
// }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = new MongoClient(url);
    await client.connect();
    
    const db = client.db(dbName);
    const issuesCollection = db.collection('issues');

    // Get request body
    const { textContent, files } = req.body;

    // Process and save the issue to MongoDB
    const result = await issuesCollection.insertOne({
      textContent,
      files: files ? files.map((file: string) => file.length) : [],
    });

    res.status(201).json({ message: 'Text/Issue uploaded successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error uploading issue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}