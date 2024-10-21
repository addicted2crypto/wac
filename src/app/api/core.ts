import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from 'uploadthing/server';
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'ImCounsulting';
const ISSUES_COLLECTION = 'issues';

interface imageUploaderOptions{
  maxFileSize?: string;
}


async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method ==='POST') {
    const { textContent, uploadedFiles } = req.body;

    try {
      const client = new MongoClient(MONGO_URI!);
      await client.connect();
      const db = client.db(DB_NAME);

      const result = await db.collection(ISSUES_COLLECTION).insertOne({
        textContent,
        files: uploadedFiles,
        created: new Date(),
      });
      res.status(201).json({ message: 'Issue submitted successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error'});
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed'});
  }
}
  export default handler;
// }
// const imageRouter = createUploadthing();
                                                                                   

// const textFileRouter = createUploadthing();

// export const ourFileRouter: FileRouter<Json> = {
//   imageUploader: imageRouter({
//     image: {maxFileSize: '4MB'},
//   })
//   .onUploadComplete(async (options: string) => {
//     console.log('Image upload complete for userId', options.metadata)
//   }),
  
   
   
//     textUploader: createUploadthing({
//       accept: '.txt, .docx, .pdf',
//       file: {maxFileSize: '4MB'}
     
//     })
// } 
 
// export type OurFileRouter = typeof ourFileRouter;