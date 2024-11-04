// // api/upload-issue-with-files.ts
import { MongoClient } from 'mongodb';
import { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';

const UPLOADTHING_TOKEN = process.env.UPLOADTHINGS_API_KEY;
const dbName = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'ImCounsulting';

const upload = multer({ dest: './uploads/' });
let fileUrls: File[];

const client = new MongoClient(MONGO_URI!);

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { textContent } = req.body;
    const files = req.files;

    // Upload files to UploadThings
    if(files && Object.keys(files).length > 0){
      const fileArray = Object.values(files)[0];
      if(fileArray.length > 0) {
        const fileUrls = await uploadFilesToUploadThings(fileArray);
    }
    
  } else {
    console.log('No files selected.');
  } 
    // Create new document for MongoDB
    const newDocument = {
      userId: '',
      textContent,
      fileUrls: fileUrls || [],
      createdAt: Date.now(),
    };

    // Connect to MongoDB and save the document
    const result = await saveIssueToMongoDB(newDocument);

    res.status(201).json({ message: 'Text/Issue uploaded successfully', description: 'This is a test doc' });
  } catch (error) {
    console.error('Error uploading issue:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function uploadFilesToUploadThings(files: File[]) {
  const fileUrls = await Promise.all(files.map(async (file) => {
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
  }));
  return fileUrls;
}

async function saveIssueToMongoDB(issueData: any) {
  try {
    // await client.connect();
    // const db = client.db(dbName);
    // const issuesCollection = db.collection('issues');

    const client = new MongoClient(MONGO_URI!);
      await client.connect();
      const db = client.db(DB_NAME);


    const result = await db.collection('issues_collection').insertOne(issueData);
    return result.insertedId;
  } catch (error) {
    console.error('Error saving issue to MongoDB:', error);
    throw new Error('Failed to save issue');
  }
}
// import { NextApiRequest, NextApiResponse } from 'next';
// import { MongoClient } from 'mongodb';
// import axios from 'axios';

// import multer from 'multer';


// if (!process.env.MONGODB_URI) {
//   throw new Error('Please add your Mongo URI to .env.local');
// }

// const UPLOADTHING_TOKEN = process.env.UPLOADTHINGS_API_KEY;
// const uploadThingsApiSecret = process.env.UPLOADTHINGS_API_SECRET;
// const url: string = process.env.MONGODB_URI;

// const dbName = process.env.DB_NAME;
// const client = new MongoClient(url);

// interface CustomNextApiRequest extends NextApiRequest {
//   body: {
//     textContent: string;
//     };
 
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       cb(null, './uploads');
//     },
//     filename: (_req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, file.fieldname + '-' + uniqueSuffix);
//     }
//   })
// });


// const uploadFileToUploadThings = async (file: File) => {
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     const response = await axios.post('https://api.uploadthings.com/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${UPLOADTHING_TOKEN}`,
//       },
//     });

//     return response.data.file_url;
//   } catch (error) {
//     console.error('Error uploading file to UploadThings:', error);
//     throw new Error('Failed to upload file');
//   }
// };

// export default upload.fields([{ name: 'textContent', maxCount: 1 }, { name: 'files', maxCount: 3 }])(
//   async function handler(req: Request &  CustomNextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }
//   try {
//     const { textContent } = req.body;
//     const files = req.files;

//     const fileUrls = await Promise.all(files.map(async (file: File) => {
//       const uploadedFileUrl = await uploadFileToUploadThings(file);
//       return uploadedFileUrl;
//     }
//     ))

//     const newDocument = {
//       userId: '',
//       textContent,
//       fileUrls,
//       createdAt: Date.now(),
//     };
//     // }
//     // })
//     // const uploadFiles = async (files: File[])=> {
//     //   const fileUrls = await Promise.all(files.map(async (file) => {
//     //     try {
//     //     const result = await start(file);
//     //     return result.url;
//     //   } catch (error){
//     //     console.error('Error uploading file:', error);
//     //     throw error;
//     //   }
//     //   }));
//     //   return fileUrls;
//     // }
//     // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     //   if (req.method !== 'POST') {
//     //     return res.status(405).json({ message: 'Method not allowed' });
//     //   }

//     // try {
//     //   const {textContent} = req.body;
//     //   const files = req.files;


//     //   const fileUrls = await Promise.all(files.map(async (file: File) => {
//     //     const uploadedFileUrl = await uploadFileToUploadThings(file);
//     //     return uploadedFileUrl;
//     //   }));

//     //   const newDocument = {
//     //     userId: '',
//     //     textContent,
//     //     fileUrls,
//     //     createdAt: Date.now(),
//     //   };




//     await client.connect();

//     const db = client.db(dbName);
//     const issuesCollection = db.collection('issues');

//     // Get request body
//     // const { textContent, files } = req.body; original *

//     // Process and save the issue to MongoDB
//     const result = await issuesCollection.insertOne(newDocument);
//     // ({
//     //   textContent,
//     //   files: files ? files.map((file: string) => file.length) : [],
//     // });

//     res.status(201).json({ message: 'Text/Issue uploaded successfully', id: result.insertedId });
//   } catch (error) {
//     console.error('Error uploading issue:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }

// }