"use client"
import { Button } from '@/components/ui/button';
import { SignIn, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';


export default function Dashboard() {
  const { user } = useUser();
  const[files, setFiles] = useState<File[]>([]);
  const[textContent, setTextContent] = useState('');
  const[isUploading, setIsUploading] = useState(false);
  const[uploadStatus, setUploadStatus] = useState('');


  

  if(!user) {
    return null;
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
    setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('/api/paid-upoad', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Upload successful!');
        setFiles([]);
        setTextContent('');
      } else {
        setUploadStatus('Upload failed. Please try again.');

      } 
    } catch (error) {
        console.error('Upload error:', error);
        setUploadStatus('An error occurred. Please try again.');

    }
    setIsUploading(false);
  };
  
  return (
    
    <div className='min-h-screen bg-[#fff]'>
      <SignedIn>
      <div className='max-w-4xl mx-auto '>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl text-sky-950 absolute left-[3rem] overflow-auto'>Welcome to your applaince solutions page!</h1>
        
        </div>
        <div className='absolute top-6 right-6'>
        <SignOutButton />
        </div>
        <div className='bg-[#606060] p-6 rounded-lg shadow-md'>
          <h2 className='bg-gray-100 p-6 rounded-lg shadow-md'>Submit Appliance Issues</h2>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder='Describe your appliance errors and problems here...'
            className='w-full p-2 border border-gray-300 rounded-md'
            rows={6}
            ></textarea>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className='mt-4'
              />
            <Button variant='outline'
              onClick={handleUpload}
              disabled={isUploading}
            >{isUploading ? 'Uploading...' : 'Submit'}
            </Button>
            {uploadStatus && <p className='mt-2 text-sm'>{uploadStatus}</p>}
        </div>
        {/* <div className='pt-8 w-max'>
        <textarea placeholder='Submit appliance Errors and problems here 👇' className='w-[23rem] '></textarea>
        </div> */}
      </div>
      <div className='mt-8 text-center text-[#101010]'>
        <p className=' font-serif text-3xl'>Over 100 years of appliance repair experience at your finger tips</p>
     
      </div>
      </SignedIn>
      </div>
  );
      }
      
      {/* <div className='absolute right-2 top-2 overflow-auto'>
       
        <SignOutButton />
      </div>
      </SignedIn>

      <SignedOut>
        <div className='flex items-end justify-end min-h-screen'>
          <div className='text-end'>
            <div className='text-2xl mb-4'>
          Please to access the dashboard.
        </div>
        <SignIn />
        </div>
        </div>
      </SignedOut>
    </div> */}
   
    
  

