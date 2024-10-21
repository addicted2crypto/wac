"use client"
import { Button } from '@/components/ui/button';
import { SignIn, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
// import { useUser } from '@clerk/nextjs';
// import { UploadButton } from "@uploadthing/react";
import React, { useState } from 'react';
// import { ourFileRouter, OurFileRouter } from '../api/core';
import axios from 'axios';
// import { User } from '@clerk/nextjs/dist/api';
// import { ourFileRouter } from '../api/core';

// const OurFileRouter = require('../api/core');
// interface ClientUploadedFileData {
//   name: string;
// }
function Dashboard() {
  const [textContent, setTextContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const issueForm = document.getElementById('issue-form');
    if (issueForm) {
      issueForm.dispatchEvent(new Event('submit', { bubbles: true }));
    }

  }

  const handleIssueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!textContent || uploadedFiles?.length === 0 ) {
      alert('Please upload at least one file');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('');
    

    // try {
    //   const response = await axios.post('/api/submit-issue', {
    //     textContent,
    //     uploadedFiles: Array.from(uploadedFiles).map((file) => file.name),
    //   });
    //   console.log(response.data);
    //   alert('Issue submitted successfully!!');
    // } catch (error) {
    //   console.error(error);
    //   alert('Error submitting issue');
    // }

   

    // interface SubmissionResult {
    //   data: ClientUploadedFileData[];
    // }

    // interface TextContent {
    //   textContent: string;
    //   files: ClientUploadedFileData[];
    // }

    // const submitIssue = async ({textContent, files} : TextContent) => {
      try {
        const formData = new FormData();
        formData.append('textContent', textContent);

       if (uploadedFiles) {
        const uploadedFilesArray = Array.from(uploadedFiles);
        for(const file of uploadedFilesArray){
          formData.append('files[]', file);
        }
       }

       const response = await fetch('/api/upload-issue-with-files',
       {
        method: 'POST',
        body: formData,
       });
       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        const data = await response.json();
        console.log('Issue uploaded successfully', data);
        setSubmitStatus('Issue uploaded successfully!');
        } catch (error) {
          console.error('Error uploading issue:', error);
          setSubmitStatus(`An error occurred while uploading, the logged issue is: ${error}` );

        } finally {
          setIsSubmitting(false);
        }
      
    //     if (files.length > 0) {
    //     await Promise.all(files.map(async (file) => {
    //       const uploadData = await ourFileRouter.signImage(file)
    //     }
    //     return await axios.post('/api/submit-issue', formData) 
    //     } catch (error) {
    //       console.error('Error submitting issue from dashboard:', error);
    //       throw error;
    //     }
    //   };

    //   const handleUploadError = (error: Error) => {
    //     console.log('Error:', error);
    //     alert(`Error from dashboard: ${error.message}`);
    //   };
    //   };
    //       headers: {
    //         'Content-Type' : 'application/json',

    //       },
    //     // }
    //   });
    //     console.log('API Response:', response.data);
    //     return response.data;
    //   } catch (error) {
    //     console.error('Error submitting issue:', error);
    //     throw error;
    //   }
    // };





    // export default function Dashboard() {
    //   const { user, isLoaded, isSignedIn } = useUser();
    //   const [uploadedFiles, setUploadedFiles] = useState<ClientUploadedFileData<null>[]>([]);
    //   const [textContent, setTextContent] = useState('');
    //   const [isSubmitting, setIsSubmitting] = useState(false);
    //   const [submitStatus, setSubmitStatus] = useState('');


    // if(!isLoaded){
    //   return <div>Loading...</div>
    // }

    // if (!isSignedIn) {
    //   return (
    //     <div className='text-sm'>
    //       <h1>Please sign in to access the dashboard</h1>
    //       <SignIn />
    //     </div>
    //   )
    // }

   

    //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     setIsSubmitting(true);
    //     try {
    //       if(!textContent.trim()){
    //         throw new Error('Please enter some text content');
    //       }
    //       const file: ClientUploadedFileData[] = await Promise.all(uploadedFiles.map((file) =>
    //       ourFileRouter
    //       ))

    //       const result = await submitIssue(textContent, [] );
    //       console.log('Submission result:', result);
    //       return;

    //     } catch (error) {
    //       console.error('An error has occured:', error);
    //     }

    //     try {
    //       const response = await fetch('/api/submit-issue', {
    //         method: 'Post',
    //         body: new FormData({
    //           textContent,
    //           files: uploadedFiles.map((file) => file.name),
    //         }),
    //       })
    //     }
    //     if(!isLoaded || !user){
    //       setSubmitStatus('User not loaded. Please try again.')
    //       return;
    //     }

    // setIsSubmitting(true);
    // setSubmitStatus('');


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
          // userId: 

        }),
      });


      if (!response.ok) {
        throw new Error(`Http error! status no response dashboard: ${response.status}`)
      }

      const data = await response.json();
      console.log('Submission successful:', data)
      setSubmitStatus('Submission successful!');
      setTextContent('');
      // setUploadedFiles([]);


    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus(`An error occurred: ${error}`);

    } finally {
      console.log('Setting isSubmitting to false')
      setIsSubmitting(false);
    }
    
  
  }
  return (

    <div className='min-h-screen bg-[#fff]'>
      <SignedIn>
        <div className='max-w-4xl mx-auto '>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='pt-6 text-2xl text-sky-950 absolute left-[3rem] overflow-auto'>Welcome to your appliance solutions page!</h1>

          </div>
          <div className='absolute top-6 right-6'>
            <SignOutButton />
          </div>
          <div className='bg-[#969595] p-6 rounded-lg shadow-md'>
            <h2 className='bg-gray-200 p-6 rounded-lg shadow-sm'>Submit Appliance Issues</h2>
            <form id='issue-form' onSubmit={handleIssueSubmit}>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder='Describe your appliance errors and problems here...'
                className='w-full p-2 border border-gray-300 rounded-md'
                rows={8}
              />
              <input type='file' multiple onChange={(e) => setUploadedFiles(e.target.files)} />
              <Button type='submit' >Submit Issues</Button>
            </form>

            
            
            <Button variant='outline'
              onClick={handleSubmitButtonClick}
              disabled={isSubmitting}
            >{isSubmitting ? 'Submitting..' : 'Submit Files'}

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


export default Dashboard;