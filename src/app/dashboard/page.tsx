"use client"
import { Button } from '@/components/ui/button';
import {  SignedIn, SignOutButton } from '@clerk/nextjs';
import { UploadButton } from '@uploadthing/react';

import React, { useState } from 'react';



function Dashboard() {
  const [textContent, setTextContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleFileUpload = async(files: File[]) => {
  try {
    if(!files.length) return;
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: new FormData(),
    });
    if(!response.ok) throw new Error('Upload failed');
  } catch (error){

    console.error('File upload error:', error);
    setSubmitStatus(`Error uploading files: ${SubmissionError}`);
  }
}

 class SubmissionError extends Error {
  status: boolean;
  constructor(message: string, status: boolean) {
    
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, SubmissionError.prototype)
    this.name = 'SubmissionError';
   
  }
}

  // const handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   // e.preventDefault();
  //   const issueForm = document.getElementById('issue-form');
  //   if (issueForm) {
  //     //add map submissions
  //     issueForm.dispatchEvent(new Event('submit', { bubbles: true }));
  //   }

  // }

  const handleIssueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      //text content from textarea

     
    const textContent = (e.target as HTMLFormElement).querySelector('textarea')?.value;
    // creating a new FormData obj
    if(!textContent?.trim()) {
      alert('Please provide a valid description');
    }
    setIsSubmitting(true);
    const filesInput = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[name="files"]');
    // const formData = new FormData(e.target as HTMLFormElement) 
    const uploadedFiles = filesInput ? filesInput.files : null;
    // if(textContent) {
    //   formData.append('textContent', textContent);
    // }
    const formData = new FormData(e.target as HTMLFormElement);

    const data = {
      userId: formData.get('userID'),
      textContent: formData.get('textContent'),
      issue: formData.get('issue'),
    }

    if (!textContent || !uploadedFiles ) {
      alert('Please upload at least one file');
      return;
      
    }

    try{
      const response = await fetch('/api/submit-issue-with-file', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data),
      });

      if(!response.ok) {
        throw new SubmissionError(`Http error! status: ${response.status}`, true);
      }
    } catch (error) {
      console.error('Error uploading issue:', error);
      setSubmitStatus(`An error occurred while uploading, the logged issue is: ${error}` );

    }
    async function uploadFiles(files: File[]): Promise<{ url?: string;}[]> {
      const promises = files.map(async (file): Promise<{url: string}> => {
        try {
        return {url: `/api/files/${file.name}`};
        } catch (error) {
          console.error('ERR uploading file: ', error);
          return {url: 'string'};
        }
      });
      return Promise.all(promises)
    }
        try {
          let fileUrls: string[] = [];
          
          if(uploadedFiles){
            const uploadResponse = await uploadFiles(FileList);
            fileUrls = [];
          }
          const data = {
            textContent,
            fileUrls: uploadedFiles ? fileUrls : [],
          }

           const response = await fetch('/api/submit-issue-with-file',
       {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data),
       });

       if(response.ok){
        alert('Issue submitted successfully finally!');
        setTextContent('');
        filesInput && (filesInput.value = '');
       } else {
        alert('Error submitting issue on dashboard...')
       }

       if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        //clear form field with .reset like a boss
      (e.target as HTMLFormElement).reset();
     
        // const data = await response.json();
        // console.log('Issue uploaded successfully', data);
        setSubmitStatus('Issue uploaded successfully!');
        } catch (error) {
          console.error('Error uploading issue:', error);
          setSubmitStatus(`An error occurred while uploading, the logged issue is: ${error}` );

        } finally {
          setIsSubmitting(false);
        }
      
    
    try {
      const response = await fetch('/api/submit-issue', {
        method: 'POST',
        body: new FormData,
        // headers: {
        //   'Content-Type': 'application/json',

        // },
        // body: JSON.stringify({


        //   textContent: textContent,
        //   files: uploadedFiles,
        //   fileUrls: uploadedFiles,
        //   // userId: userInfo,

        // }),
      });


      if (!response.ok) {
        throw new Error(`Http error! status no response dashboard: ${response.status}`)
      }

      const data = await response.json();
      console.log('Issue uploaded successfully:', data)
      setSubmitStatus('Issue uploaded successfully!!');
      // setTextContent('');
      // setUploadedFiles([]);


    } catch (error) {
      console.error('Submission error:', error);
      // setSubmitStatus(`An error occurred: ${error}`);
      setSubmitStatus(`An error occurred while uploading, the logged issue is: ${error}`);
    } finally {
      console.log('Setting isSubmitting to false')
      setIsSubmitting(false);
    }
    
  
  }
  return (
    
    <div className='min-h-screen bg-[#fff]'>
      <SignedIn>
        <div className='max-w-4xl mx-auto overflow-auto'>
          <div className='flex items-center justify-start md:text-center md:justify-center mb-8'>
            <h1 className='pt-6 text-2xl text-sky-950  overflow-auto text-center p-[.5rem]'>Welcome to your appliance solutions page!</h1>

          </div>
          <div className='absolute md:top-6 md:right-6'>
            <SignOutButton />
          </div>
          <div className='bg-[#ecf6fa] p-3 rounded-lg shadow-md'>
            <h2 className='bg-[#d7dcf0cc] p-4 rounded-lg shadow-sm text-center'>Submit appliance issues/error's in text field</h2>
            <form id='issue-form' onSubmit={handleIssueSubmit}>
               {/* e.preventDefault();
               handleSubmitButtonClick(e as React.FormEvent<HTMLFormElement>);
               }}> */}
              <textarea
                name='textContent'
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder='Describe your appliance errors and problems here adding model and serial numbers helps us diagnose more effectively. Any information about what the machine is doing you feel we should know also can be uploaded here'
                className='w-full p-2 border border-gray-300 rounded-md text-lg text-pretty'
                rows={8}
              />
              <input type='file' 
                multiple name='files'/>
              {/* multiple onChange={(e) => setUploadedFiles(e.target.files)} /> */}
              <Button type='submit' 
                // onSubmit={handleIssueSubmit}
              // onClick={handleSubmitButtonClick}
              disabled={isSubmitting}>
                {isSubmitting ? 'Submitting..' : 'Submit Files/Submit videos'}</Button>
            </form>

            
            {/* <UploadButton<OurFileRouter, "imageUploader">
              endpoint='imageUploader'
              onChange={(setUploadedFiles) => {
                if(setUploadedFiles.length > 0){
                  const firstFile = setUploadedFiles[0];
                  console.log(firstFile);
                }
                
                alert('uploaded file or video')
              }} */}
              {/* // onUploadError={(error: Error) => {
                 {/* alert(`Error ${error.message}`);
               }} */}
              
              {/* /> */}
               {/* <Button variant='outline'
              onClick={handleSubmitButtonClick}
              disabled={isSubmitting}
            >{isSubmitting ? 'Submitting..' : 'Submit Files/Submit videos'}

            </Button> */}
            
           
            {submitStatus && <p className='mt-2 text-sm'>{submitStatus}</p>}
          </div>

        </div>
        <div className='mt-8 text-center text-[#101010]'>
          <p className=' font-serif text-3xl'>Over 100 years of appliance repair experience at your finger tips</p>
        
        </div>
      </SignedIn>
      
      <div className='flex justify-center hidden:overflow h-4'>Please sign in with clerk to view dashboard</div>
    </div>
    
  );

        }


export default Dashboard;