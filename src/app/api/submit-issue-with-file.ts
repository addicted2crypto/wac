// // api/upload-issue-with-files.ts
import { Db, MongoClient } from 'mongodb';

import { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import { NextApiRequest } from 'next';



interface CustomNextApiRequest extends NextApiRequest {
  body: {
    textContent: string;
    
  };
}
const UPLOADTHING_TOKEN = process.env.UPLOADTHINGS_API_KEY;
const dbName = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'ImCounsulting';


interface IssueData {
  title: string;
  description: string;t: any
}

const issueData = {
      userId: '',
      textContent: '',
      fileUrls: FileList || [],
      createdAt: Date.now(),
    //   userId: string;
    // textContent: any;
    // fileUrls: { new (): FileList; prototype: FileList; };
    // createdAt: Number;
};

try {
  const insertedId = await saveIssueToMongoDB(issueData);
  console.log(`Issue saved successfully. ID: ${insertedId}`);
} catch (error: any) {
  console.error(error.message);
}

const upload = multer({ 
  storage: multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/uploads');
},

filename: (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  cb(null, file.fieldname + '-' + uniqueSuffix);
 }
  })
});

// let fileUrls: File[];

const client = new MongoClient(MONGO_URI!);

export default async function handler(req:NextApiRequest & CustomNextApiRequest, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { textContent } = req.body;
    const files = FileList;

    // // Upload files to UploadThings
    // if(files && Object.keys(files).length > 0){
    //   const fileArray = Object.values(files)[0];
    //   if(fileArray.length > 0) {
    //     const fileUrls = await uploadFilesToUploadThings(fileArray);
    // }
    if(!files){
      throw new Error('No files attached to submit action');
    }
    
  // } else {
  //   console.log('No files selected.');
  // } 
  //   // Create new document for MongoDB
    const newDocument = {
      userId: '',
      textContent,
      fileUrls: FileList || [],
      createdAt: Date.now(),
    };

    // Connect to MongoDB and save the document
    const result = await saveIssueToMongoDB(issueData);
  

    res.status(201).json({ message: 'Text/Issue uploaded successfully', description: 'This is a test doc' });
  } catch (error) {
    console.error('Error uploading issue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function uploadFilesToUploadThings(file: File): Promise<string> {
  // const fileUrls = await Promise.all(files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('https://api.uploadthings.com/upload', FormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${UPLOADTHING_TOKEN}`,
        },
      });
    
      return response.data.file_url;
    } catch (error) {
      console.error('Error uploading file to UploadThings:', error);
      throw new Error('Failed to upload file');
    }
  }
 async function connectMongoDB() {
  try {
    const client = new MongoClient(MONGO_URI!);
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB in submit: ', error);
    throw new Error('Failed to connect to MongoDB in submit file');
  }
 }

 async function getDatabase(client: MongoClient, dbName: string) {
  try {
    return client.db(dbName);
  } catch (error) {
    console.error(`Error getting database ${dbName}:`, error);
    throw new Error(`Failed to retieve database ${dbName}`);
  }
 }

 async function insertIntoCollection(db: Db, collectionName: string, data: any) {
  try {
    const collection = db.collection(collectionName);
    return await collection.insertOne(data);
  } catch (error) {
    console.error (error)
      console.error('Error inserting into collection', error)
      throw new Error('Failed to insert into collection');
    
  }
 }
 async function closeMongoDBClient(client: MongoClient) {
  try {
    await client.close();
  } catch (error) {
    console.error('Error closing MongoDB client:', error);
  }
}


async function saveIssueToMongoDB(issue: {
  
    title: string;
    description: string;
    // userId: string;
    // textContent: any;
    // fileUrls: { new (): FileList; prototype: FileList; };
    // createdAt: Number;
  
  })
 {
  let client;
  try {
   
    client = await connectMongoDB();
    const db = await getDatabase(client, DB_NAME);
    const result = await insertIntoCollection(db, 'issues_collection', issueData)
     return result.insertedId;
    
  } catch (error) {
    console.error('Error connecting to MongoDB check submit file', error);
    throw new Error('Failed to connect to MongoDB in submit file');
  } finally{
    if (client) {
      await closeMongoDBClient(client);
    }
  };
  
}

