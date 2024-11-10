// // api/upload-issue-with-files.ts
import { Db, InsertOneResult, MongoClient, Collection } from 'mongodb';
import { Request, Response } from 'express';

import axios from 'axios';



const UPLOADTHING_TOKEN = process.env.UPLOADTHINGS_API_KEY;
const dbName = process.env.DB_NAME;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'ImCounsulting';


// interface CustomNextApiRequest extends NextApiRequest {
//   body: {
//     textContent: string;
    
//   };
// }
interface CustomFileList extends FileList {
  item(index: number): File | null;
}


interface IssueData {
  title: string;
  description: string;
  userId: string;
  textContent: string;
  fileUrls: FileList;
  createdAt: number;

  
}



// const issueData = {
//       // userId: '',
//       // textContent: '',
//       // fileUrls: FileList || [],
//       // createdAt: Date.now(),
//     title: '',
//     description: '',
    
// };

//add this fileList block was an attempt to fix the insert id and connect to mongoDB errors, 
// const fileList = new FileList()
// const newIssue = {
//   title: 'New Issue title',
//   description: 'Details of the issue',
//   userId: 'Logged user Id',
//   textContent: 'Field for uploaded text from clients',
//   fileUrls: fileList,
//   createdAt: new Date().getTime()
// };

// try {
//   const insertedId = await saveIssueToMongoDB(newIssue);
//   console.log(`Issue saved successfully. ID: ${insertedId}`);
// } catch (error: any) {
//   console.error(error.message);
// }

// const upload = multer({ 
//   storage: multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/uploads');
// },

// filename: (req, file, cb) => {
//   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//   cb(null, file.fieldname + '-' + uniqueSuffix);
//  }
//   })
// });

// let fileUrls: File[];


const client = new MongoClient(MONGO_URI!);

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file' , file);

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





async function uploadIssuesData(textContent: string, files?: FileList): Promise<IssueData> {
  const newDocument= {
    userId: '',
    textContent,
    fileUrls: new DataTransfer().files,
    createdAt: Date.now(),
  };
    // const formData = new FormData();
    // formData.append('file',);
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



async function saveIssueToMongoDB(issue: IssueData): Promise<string> {
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

    client;

    let issueData: IssueData & { fileUrls: CustomFileList} = {
      userId: 'current_user_id',
      description: 'Issue Description',
      textContent,
      fileUrls: {
        length: 0,
        item: (index) => null 
      },
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
