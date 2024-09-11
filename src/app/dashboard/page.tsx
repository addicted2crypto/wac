"use client"
import { Button } from '@/components/ui/button';
import { SignIn, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { UploadButton } from "@uploadthing/react";
import  { UploadFileResult }  from 'uploadthing/types';
import React, { useEffect, useState } from 'react';
import { OurFileRouter } from '../api/uploadthing/core';
import { metadata } from '../layout';


export default function Dashboard() {
  const { user } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textContent, setTextContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');





  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if(e.target.files){
  //   setFiles(Array.from(e.target.files));
  //   }
  // };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('');

  //   const formData = new FormData();
  //   files.forEach((file) => formData.append('files', file));
  //   formData.append('textContent', textContent);
  //   formData.append('userId', user.id);

  try {
    const response = await fetch('/api/submit-issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        userId: user?.id,
        textContent,
        fileUrls: uploadedFiles,
      }),
    });





    if (response.ok) {
      setSubmitStatus('Submission successful!');
      setTextContent('');
      setUploadedFiles([]);

    } else {
      setSubmitStatus('Submission failed. Please try again.');

    }
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitStatus('An error occurred. Please try again.');

  }
  setIsSubmitting(false);
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
        <div className='bg-[#969595] p-6 rounded-lg shadow-md'>
          <h2 className='bg-gray-200 p-6 rounded-lg shadow-sm'>Submit Appliance Issues</h2>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder='Describe your appliance errors and problems here...'
            className='w-full p-2 border border-gray-300 rounded-md'
            rows={8}
          />


          <UploadButton<OurFileRouter, "imageUploader">
            endpoint='imageUploader'
            
            onClientUploadComplete={(res: UploadFileResult[]) => {
              if (res) {
                const newUrls = res
                .filter((file) => 'data' in file && file.data !== null)
                .map((file) => 'data');
                // setUploadedFiles(prev => [...prev, ...newUrls]);
                alert('Upload Complete');
              }
            }}
            onUploadError={(error) => {
              console.log('Error:', error);
              
           
              alert(`Error! ${error.message}`);
            }}


          />
          {uploadedFiles.length > 0 && (
            <div className='mt-4'>
              <p>Uploaded files:</p>
              <ul>
                {uploadedFiles.map((url, index) => (
                  <li key={index}>{url}</li>
                ))}
              </ul>
            </div>
          )}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className='mt-4'
          />
          <Button variant='outline'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >{isSubmitting ? 'Submitting..' : 'Submit'}
          </Button>
          {submitStatus && <p className='mt-2 text-sm'>{submitStatus}</p>}
        </div>

      </div>
      <div className='mt-8 text-center text-[#101010]'>
        <p className=' font-serif text-3xl'>Over 100 years of appliance repair experience at your finger tips</p>

      </div>
    </SignedIn>
  </div>
);
                }    

