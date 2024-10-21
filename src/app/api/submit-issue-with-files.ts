import type { NextApiRequest, NextApiResponse } from 'next';


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = './uploads';
    form.keepExtensions = true;

    await new Promise((resolve, reject) => {
      form.parse(req, (err: string, fields: string, files: File[]) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { textContent } = req.body;
    const fileNames = Object.keys(req.files).map(key => req.files[key].newFilename);

    // Process the submission here
    console.log('Received submission:', textContent, fileNames);

    return res.status(201).json({ message: 'Issue submitted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}