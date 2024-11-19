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
  fileUrls: CustomFileList;
  createdAt: number;


}



export async function saveIssueToMongoDB(issuedata: IssueData & { fileUrls: CustomFileList }): Promise<string | undefined> {
  
  const client = new MongoClient(MONGO_URI!);
  await client.connect();

  
    try {

      const client = new MongoClient(MONGO_URI!, {});
      await client.connect();

      const db = client.db(DB_NAME);
      const issuesCollection = db.collection('issues_collection');
      const result = await issuesCollection.insertOne({
        title: issuedata.description,
        textContent: issuedata.textContent,
        files: issuedata.files ? Array.from(issuedata.files).map(file => file.name) : undefined
      });

      return result.insertedId.toString();
    } finally {
      await client.close();
    }
  }
      


//     } catch (error) {
//       console.error('Error connecting to MongoDB check submit file', error);
//       throw new Error('Failed to save issue submit-issue-with file route');

//     }
// }
export default async function handler(req: Request, res: Response) {


  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { title, description } = req.body;
    let fileUrls: string | string[] | undefined;
   
    if(req.files && Object.keys(req.files).length > 0) {
      fileUrls = await uploadFiles(Object.values(req.files));
    }


    

    const issueData: IssueData  = {

      // userId: 'current_user_id',
      title,
      description,
      textContent
      
    };
    if (fileUrls) {
      issueData.files = new FileList();
      
      for (const url of fileUrls) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], 'image.jpg', { type: blob.type });
            issueData.files = new FileList([...issueData.files, file]);
          })
          .catch(error => console.error('Error fetching file:', error));
      }
    }
    
    const insertedId = await saveIssueToMongoDB(issueData);
    
    res.json({ message: 'Issue saved successfully', id: insertedId });
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
      // fileUrls: {
      //   length: 0,
      //   item: (index) => null,

      //   [Symbol.iterator]() {
      //     let index = 0;
      //     const items = Object.values(this);
      //     return {
      //       next(): IteratorResult<File> {
      //         if (index === items.length) {
      //           return { done: true, value: undefined };
      //         } else {
      //           return { value: items[index++], done: false };
      //         }
      //       },
      //       [Symbol.iterator]() {
      //         return this;
      //       },
      //     };
      //   },
      // },
     
      // createdAt: Date.now(),
    };

//     if (file) {
//       const fileList = issueData.fileUrls as CustomFileList & { [key: number]: Express.Multer.File };
//       (fileList[fileList.length] as Express.Multer.File) = file;
//       Object.defineProperty(fileList, 'length', { value: fileList.length + 1 });
//     }

//     const insertedId = await saveIssueToMongoDB(issueData);

//     res.json({ message: 'Issue saved successfully', id: insertedId });
//   } catch (error: unknown) {
//     console.error('An error occured: ', error);
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
  
//   }

// }
