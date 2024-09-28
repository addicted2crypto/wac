import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';


// import { sendCustomerNotification, sendAdminNotification } from '../../lib/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // TODO: Check if the user has paid for the service
  // This could involve checking a 'subscription' field in your user document
  // or integrating with a payment provider's API

  try {
    const { db } = await connectToDatabase();
    
    // TODO: Handle file upload
    // For this example, we'll assume the files are already uploaded to a temporary location
    // and we're just storing the file paths
    const { filePaths, textContent } = req.body;

    const upload = await textContent.insertOne({
      userId,
      filePaths,
      textContent: textContent,
      timestamp: new Date(),
    });

    // await sendCustomerNotification(userId, 'Your files have been successfully uploaded.');
    // await sendAdminNotification('New files uploaded by user: ' + userId);

    res.status(200).json({ message: 'Upload successful', uploadId: upload.insertedId });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing upload' });
  }
}