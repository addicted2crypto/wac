import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = getAuth(req);
    console.log('Extracted userId:', userId);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { textContent, fileUrls } = req.body;

    // Here you would typically save this data to your database
    console.log('Received submission:', { userId, textContent, fileUrls });

    res.status(200).json({ message: 'Issue submitted successfully' });
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}