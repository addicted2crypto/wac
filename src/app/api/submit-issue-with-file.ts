// // api/upload-issue-with-files.ts
import { Db, InsertOneResult, MongoClient, Collection } from 'mongodb';
import { Request, Response } from 'express';
import axios from 'axios';

import { upload, uploadSingle } from '../multerConfig'
import multer from 'multer';



const UPLOADTHING_TOKEN = process.env.UPLOADTHINGS_API_KEY;
const dbName = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'ImCounsulting';



async function submitFile(req: Request, res: Response) {
  try {
    await uploadSingle(req, res, cb);
    const file = req.file;
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Upload the file to UploadThings and save the URL
    const uploadedUrl = await uploadFileToUploadThings(file);
    res.json({ message: 'File uploaded successfully', url: uploadedUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
}

interface CustomFileList extends FileList {
  item(index: number): File | null;
}

class SubmissionError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}
// const file: Express.Multer.File = File


interface IssueData {
  title: string;
  description: string;
  userId: string;
  textContent: string;
  fileUrls: FileList;
  createdAt: number;

  
}



async function submitIssueWithFile(req: Request, res: Response) {
  try{
    const { title, description } = req.body;
    const file = req.file;
    if(!file || !title || !description){
      return res.status(400).json({ error: 'Missing required fields or file'});
    }
    const formData = new FormData();
    formData.append('file', file);
    try{
      const response = await axios.post('https://api.uploadthings.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response.status === 200){
        const issueData = {
          title, 
          description,
          fileUrl: response.data.file_url,
          createdAt: Date.now()
        };
        
        const insertedId = await saveIssueToMongoDB(issueData);
       
        res.json({ message: 'Issue saved successfully', id: insertedId });
      } else {
        throw new Error('File upload failed')
      }
    } catch(error) {
      console.error('Error uploading file:', error);
      res.status(500).json({error: 'Internal Server Error'});
    } catch(error) {
      console.error('Error handling request:', error);
      res.status(400).json({ error: 'Bad Request'});
    }
  }
  
}


const client = new MongoClient(MONGO_URI!);

async function uploadFiles(files: FileList): Promise<string> {
  const formData = new FormData();
  for(const file of files){
  formData.append('files[]' , file);
  }
  try { 
   const response = await axios.post('https://api.uploadthings.com/upload', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data',
      'Authorization' : `Bearer ${UPLOADTHING_TOKEN}`,
    },
   });
   return response.data.file_url;
  } catch (error: any) {
    throw new Error('Failed to upload file submit-issue route:,', error)
  }
  
}







export async function saveIssueToMongoDB(issue: IssueData): Promise<string> {
  let client: MongoClient;
   console.table('IssueData called');
  
  try {
   
     client = new MongoClient(MONGO_URI!, {});
    await client.connect();

    const db = client.db(DB_NAME);
    const collection: Collection<IssueData> = db.collection('issues_collection');
    const result: InsertOneResult<IssueData> = await collection.insertOne(issue);
    return result.insertedId.toString();
    

  } catch (error) {
    console.error('Error connecting to MongoDB check submit file', error);
    throw new Error('Failed to save issue: ');

  } finally {
    if (client!) {
      await client.close();
    }
  }
}
export default async function handler(req: Request, res: Response) {
 

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { textContent } = req.body;
    const file: Express.Multer.File | undefined = req.file;

    // client;
 

    let issueData: IssueData & { fileUrls: CustomFileList;} = {

      userId: 'current_user_id',
      title: 'Issue Title',
      description: 'Issue Description',
      textContent,
      fileUrls: {
        length: 0,
        item: (index) => null, 
      
        [Symbol.iterator]() {
          let index = 0;
          const items = Object.values(this);
          return {
            next(): IteratorResult<File> {
              if (index === items.length) {
                return { done: true, value: undefined };
              } else {
                return { value: items[index++], done: false };
              }
            },
            [Symbol.iterator]() {
              return this;
          },
        };
      },
    },
      // },
      createdAt: Date.now(),
    };

    if (file) {
      const fileList = issueData.fileUrls as CustomFileList & { [key: number]: Express.Multer.File };
      (fileList[fileList.length] as Express.Multer.File) = file;
      Object.defineProperty(fileList, 'length', { value: fileList.length + 1});
    }

    const insertedId = await saveIssueToMongoDB(issueData);

    res.json({ message: 'Issue saved successfully', id: insertedId });
  } catch (error: unknown) {
    console.error('An error occured: ', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).json({ error: 'Internal Server Error'});
  }
  
}

}
