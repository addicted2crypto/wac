"use client"
import { Button } from '@/components/ui/button';
import { SignIn, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { UploadButton } from "@uploadthing/react";
import React, {  useState } from 'react';
import { OurFileRouter } from '../api/core';
import { ClientUploadedFileData } from 'uploadthing/types';





export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<ClientUploadedFileData<null>[]>([]);
  const [textContent, setTextContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');


if(!isLoaded){
  return <div>Loading...</div>
}

if (!isSignedIn) {
  return (
    <div className='text-sm'>
      <h1>Please sign in to access the dashboard</h1>
      <SignIn />
    </div>
  )
}

 

  const handleSubmit = async () => {
    if(!isLoaded || !user){
      setSubmitStatus('User not loaded. Please try again.')
      return;
    }

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
        
        
        textContent: textContent,
        files: uploadedFiles,
        fileUrls: uploadedFiles,
        userId: user.id,
      
      }),
    });


    if(!response.ok) {
      throw new Error(`Http error! status: ${response.status}`)
    }

    const data = await response.json();
      console.log('Submission successful:', data)
      setSubmitStatus('Submission successful!');
      setTextContent('');
      setUploadedFiles([]);

    
  } catch (error) {
    console.error('Submission error:', error);
    setSubmitStatus(`An error occurred: ${error}`);
 
  }finally {
    console.log('Setting isSubmitting to false')
    setIsSubmitting(false);
  }

};

return (

  <div className='min-h-screen bg-[#fff]'>
    <SignedIn>
      <div className='max-w-4xl mx-auto '>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='pt-6 text-2xl text-sky-950 absolute left-[3rem] overflow-auto'>Welcome to your applaince solutions page!</h1>

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
            
            onClientUploadComplete={(res) => {
              if (res) {
               
                //change setUploadedFiles (PREV here?)
                setUploadedFiles(prevFiles => [...prevFiles, ...res]);
                alert('Upload Complete');
              }
            }}
            //     (res => {
            //    const newUrls = res.map((file) => file);
            //    return [...res, ...newUrls];
            //   });
            //     alert('Upload Complete');
            //   }
            // }}
            onUploadError={(error) => {
              console.log('Error:', error);
              
           
              alert(`Error! ${error.message}`);
            }}


          />
          {uploadedFiles.length > 0 && (
            <div className='mt-4'>
              <p>Uploaded files:</p>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
          {/* <input
            type="file"
            multiple
            onChange={handleSubmit}
            className='mt-4'
          /> */}
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
