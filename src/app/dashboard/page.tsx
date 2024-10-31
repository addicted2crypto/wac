"use client"
import { Button } from '@/components/ui/button';
import {  SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import React, { useState } from 'react';


function Dashboard() {
  const [textContent, setTextContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const issueForm = document.getElementById('issue-form');
    if (issueForm) {
      //add map submissions
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
    

    
      try {
        const formData = new FormData();
        formData.append('textContent', textContent);

       if (uploadedFiles) {
        const uploadedFilesArray = Array.from(uploadedFiles);
        for(const file of uploadedFilesArray){
          formData.append('files[]', file);
        }
       }

       const response = await fetch('/api/submit-issue-with-file',
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
          // userId: userInfo,

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
        <div className='max-w-4xl mx-auto overflow-auto'>
          <div className='flex items-center justify-start md:text-center md:justify-center mb-8'>
            <h1 className='pt-6 text-2xl text-sky-950 absolute left-[3rem] overflow-auto text-center p-[.5rem]'>Welcome to your appliance solutions page!</h1>

          </div>
          <div className='absolute md:top-6 md:right-6'>
            <SignOutButton />
          </div>
          <div className='bg-[#ecf6fa] p-3 rounded-lg shadow-md'>
            <h2 className='bg-[#d7dcf0cc] p-4 rounded-lg shadow-sm text-center'>Submit appliance issues/error's in text field</h2>
            <form id='issue-form' onSubmit={handleIssueSubmit}>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder='Describe your appliance errors and problems here adding model and serial numbers helps us diagnose more effectively. Any information about what the machine is doing you feel we should know also can be uploaded here'
                className='w-full p-2 border border-gray-300 rounded-md text-lg text-pretty'
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
      
      <div className='flex justify-center hidden:overflow h-4'>Please sign in with clerk to view dashboard</div>
    </div>
    
  );

        }


export default Dashboard;