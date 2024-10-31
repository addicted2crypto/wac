import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

import { connectToDatabase } from '@/lib/mongodb';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await connectToDatabase();
    const issuesCollection = db.collection('issues');

    const cursor = issuesCollection.find({ userId });

    const result = await cursor.toArray();

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return res.status(500).json({ message: 'Failed to fetch issues' });
  }
}