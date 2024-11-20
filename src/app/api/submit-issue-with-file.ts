// // api/upload-issue-with-files.ts
import {   MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Request, Response } from 'express';
import axios from 'axios';
import { User } from '@clerk/nextjs/dist/types/server';
import { connectToDatabase } from '@/lib/mongodb';


// import { upload, uploadSingle } from '../multerConfig'
// import multer from 'multer';
// import { stringify } from 'querystring';
// import { arrayBuffer } from 'stream/consumers';

type CustomNextApiRequest = NextApiRequest & {
  user?: User;
}

const UPLOADTHING_TOKEN = process.env.UPLOADTHINGS_API_KEY;

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'ImCounsulting';



interface CustomFileList extends FileList {
  forEach(callback: (value: File, index: number, array: FileList) => void): void;
  item(index: number): File | null;
}

// class SubmissionError extends Error {
//   constructor(message: string, public status?: number) {
//     super(message);
//   }
// }











async function uploadFiles(files: File[]): Promise<string[]> {
  const fileUrls = [];

  const formData = new FormData();
  // files.forEach((file, index) => {
  //   formData.append(`files[${index}]`, file.originalname);
  // })
  for (const file of files) {
    formData.append('file', file);
  }
  try {
    const response = await axios.post('https://api.uploadthings.com/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${UPLOADTHING_TOKEN}`,
      },
    });
    if(response.status === 200){
      fileUrls.push(response.data.data.link)
    } else {
      throw new Error(`Error uploading file with-file.ts: ${response.statusText} `);
    }
    // return response.data.file_url;
  } catch (error: any) {
    throw new Error('Failed to upload files submit-issue route:,', error)
  }
    return fileUrls;
}



interface IssueData {
  title: string;
  description: string;
  userId: string;
  textContent: string;
  fileUrls: CustomFileList & { [key: number]: Express.Multer.File};
  createdAt: number;


}



export async function saveIssueToMongoDB(issuedata: IssueData & { fileUrls: CustomFileList }): Promise<string | undefined> {
  
  const client = new MongoClient(MONGO_URI!);
  await client.connect();

  
    try {

      const client = new MongoClient(MONGO_URI!, {});
      await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection('issues_collection');
    const result = await collection.insertOne(issuedata);
    
    await client.close();
    
    return result.insertedId.toString();
    

  } catch (error) {
    console.error('Error connecting to MongoDB check submit file', error);
    throw new Error('Failed to save issue submit-issue-with file route');

//     }
}
}

interface UploadData {
  title: string;
  description: string;
  userId: string;
  textContent: string;
  [key: string]: any,
}

async function uploadToUploadThings(data: UploadData): Promise<string[]> {
  const fileUrls = [];
  
  const formData = new FormData();
  for (const key in data) {
    if (typeof data[key] === 'string') {
      formData.append(key, data[key]);
    }
  }
  
  try {
    const response = await axios.post('https://api.uploadthings.com/upload ', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${UPLOADTHING_TOKEN}`,
      },
    });
    
    if (response.status === 200) {
      fileUrls.push(response.data.data.link);
    } else {
      throw new Error(`Error uploading to UploadThings: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Failed to upload to UploadThings:', error.message);
    throw error;
  }
  
  return fileUrls;
}
// 

export default async function handler(req: Request, res: Response) {


  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, description } = req.body;
    // let fileUrls: string | string[] | undefined;
   
    // if(req.files && Object.keys(req.files).length > 0) {
    //   fileUrls = await uploadFiles(Object.values(req.files));
    // }

// 
    

    const uploadData: UploadData  = {
      title,
      description,
      userId: 'current_user_id',
      textContent: 'Data_text_field',
    };

    const fileUrls = await uploadToUploadThings(uploadData);
    
    let issueFileList: CustomFileList & { [ key: number ] : File} = {
      length: 0,
      item: (index) => null,
      [Symbol.iterator](): ArrayIterator<File> {
        let index = 0;
        const self = this;
        
        return  () => {
            next: function() {
                if (index < self.length) {
                    const file = self[index];
                    index++;
                    return { value: file, done: false };
                }
                return { value: undefined, done: true };
            },
            
            [Symbol.iterator]: function() {
                return this;
            }
        }
    }
      // [Symbol.iterator](): () => IteratorResult<File, void> {
      //   let index = 0;
      //   return () => {
      //     if (index < this.length) {
      //       const file = this[index];
      //       index++
      //       return {value: file, done: false };
      //     }
      //     return { value: undefined, done: true}
      //   }
        // const items = Object.values(this);
        // return {
        //   next(): IteratorResult<File> {
        //     if(index === items.length) {
        //       return { done: true, value: undefined};
        //     } else {
        //       return { value: items[index++], done: false };
        //     }
        //   },
        //   [Symbol.iterator]() {
           


    const uploadedFile = req.file as Express.Multer.File;
    issueFileList[issueFileList.length] = uploadedFile;
    Object.defineProperty(issueFileList, 'length', {value: issueFileList.length + 1})


    const issueData: IssueData = {
      ...uploadData,
      fileUrls: issueFileList,
      createdAt: Date.now()
    };


    // if (File) {
    //   const fileList = issueData.fileUrls as CustomFileList & { [key: number]: Express.Multer.File };
    //   (fileList[fileList.length] as Express.Multer.File) = file;
    //   Object.defineProperty(fileList, 'length', { value: fileList.length + 1});
    // }
    
    const insertedId = await saveIssueToMongoDB(issueData);
    
    res.json({ message: 'Issue saved successfully', id: insertedId });
  } catch (error: any) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  


}
