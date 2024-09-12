import { connectToDatabase } from '@/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, textContent, fileUrls } = req.body;

    const { client, db } = await connectToDatabase();

    const collection = db.collection('appliance_issues');

    const result = await collection.insertOne({
      userId,
      textContent,
      fileUrls,
      createdAt: new Date(),
    });

    client.close();

    res.status(200).json({ message: 'Issue submitted successfully', id: result.insertedId });
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}