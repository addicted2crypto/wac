import  { NextApiRequest, NextApiResponse } from 'next';

import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Db } from 'mongodb';
import  multer from 'multer';



const upload = multer({
  dest: './uploads',
 
  limits: {fileSize: 1000000},
});


//bringing in mongo connection from connectToDatabase! winning
// const uploadHandler = createUploadHandler({
//   upload,
//   maxBodySize: 5 * 1024 * 1024,
// })
interface NextApiRequestWithFile extends NextApiRequest {
  file?: any;
}

interface CustomNextApiRequest extends NextApiRequest {
  file?: any;
}



export const config = {
  api: {
    bodyParser: false,
  },
  // dest: '/uploads/',
};

interface SubmitIssueRequestBody {
  textContent: string;

}

async function saveUploadedFile(file: any): Promise<string[]> {
 
  return [file.filename];
}

// const dbClient = await connectToDatabase();

export  async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  // 
  const app = nextConnect<NextApiRequest, NextApiResponse>({onError,});

  app.use(upload.single('file'));
 
    await new Promise((resolve, reject) => {
    //   const uploadSingle = upload.single('file');
    //   uploadSingle(req, res, (err) => {
    //     if(err){
    //       return reject(err)
    //     }
    //   })
    // })
  })
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
   
  try {
      const userId = getAuth(req)?.userId;
      
    if (!userId) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }
    try {
      const userId = getAuth(req)?.userId;

      if(!userId) {
        return res.status(401).json({message: 'User is not authenticated'});
      }

      await upload.single('file')(req, res, (err) => {
       
        if(err instanceof multer.MulterError) {
          console.log('Multer err intance error');
        } else if (err){
          console.log('Handle error for upload single better');
        }
      });
    
    } catch(error){
      console.error(error);
    }
    
    const { textContent } = req.body as SubmitIssueRequestBody;
    // console.log('Request body: ', { textContent, files });
    if(!textContent.trim()) {
      throw new Error('Text content is required');
    }
  
    // const issues = db.collection('ImCounsulting');  /* db name */


    let fileUrls: string[] | undefined;

  //  console.log('fileUrls: ',fileUrls)
  if(req.file && req.file.filename) {
    // const savedFileUrl = await saveUploadedFile(req.file);
    fileUrls = await saveUploadedFile(req.file);
  }

    // if (files && Array.isArray(files) && files.length > 0 ) {
    //   fileUrls = files.map(file => file.url).filter(Boolean) 
    // }
      
      const issueData = {userId, textContent, fileUrls }; 
      const dbClient = await connectToDatabase();
      // const result = await insertIssue(dbClient.db, issueData);
        // const result = await insertIssue(dbClient.db, issueData);

        // console.log('Saved to MongoDb', result.insertedId);
    

 
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