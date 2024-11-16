import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

import { connectToDatabase, insertIssue } from '@/lib/mongodb';
import { Db } from 'mongodb';
import multer from 'multer';
import { Request as ExpressRequest } from 'express';




const upload = multer({
  dest: './uploads/',
})
//bringing in mongo connection from connectToDatabase! winning

interface NextApiRequestWithFile extends ExpressRequest {
  file?: any;
}

export const config = {
  api: {
    bodyParser: false,
  },
  dest: '/uploads/',
};

interface SubmitIssueRequestBody {
  textContent: string;
  // files?: {
  //   name: string;
  //   type: string;
  //   size: number;
  //   url: string;
   
  // }[];  files are not in this file anymore
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
const dbClient = await connectToDatabase();

export  async function handler(req: NextApiRequest, res: NextApiResponse) {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
   
  try {
      const userId = getAuth(req)?.userId;
      
    if (!userId) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }

    upload.single('file')(req, res, (err) => {
      if(err){
        throw err;
      }
    })

    const { textContent } = req.body as SubmitIssueRequestBody;
    // console.log('Request body: ', { textContent, files });
    if(!textContent.trim()) {
      throw new Error('Text content is required');
    }

    // const issues = db.collection('ImCounsulting');  /* db name */


    let fileUrls: string | undefined;

  //  console.log('fileUrls: ',fileUrls)
  if(req.file && req.file.filename) {

  }

    if (files && Array.isArray(files) && files.length > 0 ) {
      fileUrls = files.map(file => file.url).filter(Boolean) 
    }
      
      const issueData = {userId, textContent, fileUrls }; 

        // const result = await insertIssue(dbClient.db, issueData);

        console.log('Saved to MongoDb', result.insertedId);
    

 
    return res.status(200).json({ message: 'Issue submitted successfully'})
  } catch (error) {
    console.error('API route error :', error);
    // res.status(500).json({ message: 'Internal server error' });
    return res.status(500).json({ message: 'Internal server error'})
  } 
}

async function insertIssue(db: Db, issueData: string) {
  try {
    const result = await db.collection('ImCounsulting')
    return result
  } catch (error) {
    console.error('Error inserting issue:', error.message);
    throw new Error('Failed to save issue to MongoDB');
  }
}


// export default async function submitIssue(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     if (req.method === 'POST') {
//       const { userId, textContent, files } = req.body;
      
//       // Handle file uploads using UploadThing
//       let fileUrls: string[] = [];
//       if (files && Array.isArray(files) && files.length > 0 ) {
//         fileUrls = files.map(file => file.url).filter(Boolean)
//       }
      
//       const issueData = { userId, textContent, fileUrls };
      
//       // Connect to MongoDB and insert the data
//       const { client, db } = await connectToDatabase();
      
//       const result = await insertIssue(db, issueData);
      
//       res.status(200).json({ message: 'Issue submitted successfully'});
//     } else {
//       res.status(405).json({ message: 'Method not allowed'})
//     }
//   } catch (error) {
//     console.error('API route error:', error);
//     res.status(500).json({ message: 'Internal server error'})
//   }
// }