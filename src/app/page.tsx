
import WidthWrapper from '@/components/ui/Widthwrapper';
import { clerkClient } from '@clerk/nextjs/server';
import Image from "next/image";





export default function Home() {
  const  userId  = '';
  const User =  clerkClient().users.getUser(userId);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WidthWrapper className="mb-12 mt-28 sm:mt-40 bg-slate-300 flex flex-col items-center justify-center text-center">

    
<p className="mt-4 Smx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-400 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-800 hover:bg-white/30">
  <span className='text-sm font-semibold text-gray-900'>
    William's Appliance Consult is now live!
  </span>
</p>
<h1 className='max-w-6xl text-5xl font-bold md:text-6xl lg:text-7xl'>
Do you have an Appliance that is acting up? Schedule your consult<span className='text-red-700'> before wasting <span className="text-green-600"> $$$$ </span></span> on an in person diagnostic.
</h1>
<p className='mt-6 max-w-pros text-zinc-800 sm:text-lg'>
  William's Consult app allows you to upload pictures as PDF documents. 
  The app also allows for forms and text input to articulate all the issues 
  with your appliance. This info is crucial so I can properly diagnose your machine, and save you time and money!
</p>
<p className='mt-4 max-w-pros text-zinc-600 sm:text-lg'>
  Is your appliance causing issues or suddenly stopped working? Encountering error codes? Here's a little-known secret that the "experts" don't want you to know:
  traditional in-person diagnostics can cost over $120.00(national diagnostic average). With that being said, the good news is with over 
  a decade of experience and a network of skilled technicians, I can address these concerns remotely, saving you money. Schedule a consultation,
  and we'll efficiently resolve the issues remotely at a fraction of the cost, without the wait for a technician.
</p>
{/* <Link className={
  size: 'lg',
  className: 'mt-12 mb-12'
  
}href='/dashboard' target='_blank'> */}
<div>
  {!User ? (
    
   <div>/</div>
   
   ) :(
    
  
    <div>
  <div className='hover:animate-bounce'>We value your input. Leave a review here!</div>
  
   <div className='w-max text-[#000]'/>
   <textarea placeholder=' Rate your experience 👍 or 👎 👇'color='black' className='min-w-max bg-[#3c77c9] text-[#000] rounded-sm  '></textarea>
   </div>
  )}
  </div>
  
  
</WidthWrapper>
{/* value proposition section */}   
                                                                                         
<div>
  <div className='relative isolate' >
    <div aria-hidden="true"className='pointer-events-none absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
      <div style={{
        clipPath:"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
      }}className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7cbdeb] to-[#3e32ff] opacity-30 sm:left-[calc(50%-33rem)] sm:w-[72.187rem]' 
      />

    </div>
      <div>
        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <Image 
              src='/appliance_logo.png'
              alt='WAC logo'
              width={2000}
              height={1500}
              quality={100}
              className='rounded-md bg-[#dcdce0] p-2 sm:p-4 shadow-2xl ring-1 ring-gray-950/75'
              />

            </div>
            </div>
        </div>
      
      {/* <div style={{
        clipPath:
        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
      }}className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7cbdeb] to-[#3e32ff] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.187rem]' 
      /> */}
  </div>
</div>
</div>
{/*features */}
<div className='mx-auto mb-32 mt-32 max-w-5xl sm:mt-56'>
  <div className='mb-12 mx-6 lg:px-8'>
    <div className='mx-auto max-w-2xl sm:text-center'>
      <h2 className='mt-2 font-bold text-4xl text-gray-950 sm:text-5xl'>Contact a tech in minutes to talk about your appliance</h2>
      <p className='mt-4 text-lg text-gray-650'>Getting a quick estimate to repair your broken appliance has never been easier/so quickly accessible.</p>
    </div>
  </div>
  {/*steps*/}
  <ol className='my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0'>
    <li className='md:flex-1'>
      <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pt-4'>
        <span className='text-sm font-medium text-blue-900'>Step 1</span>
        <span className='text-xl font-semi-bold'>Sign up for a consult</span>
        <span className='mt-2 text-zinc-800'>Log in and schedule a time for us to discuss your appliance.</span>
      </div>
    </li>
  
    <li className='md:flex-1'>
      <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4  md:border-l-0 md:border-t-2 md:pb-0 md:pt-4'>
        <span className='text-sm font-medium text-blue-900'>Step 2</span>
        <span className='text-xl font-semi-bold'>Log your issues</span>
        <span className='mt-2 text-zinc-800'>Upload text to describe your appliance problems. Upload pictures to show model/serial number without having to write it out. Upload pictures of appliance issues.</span>
      </div>
    </li>
  
  
    <li className='md:flex-1'>
      <div className='flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4  md:border-l-0 md:border-t-2 md:pb-0 md:pt-4'>
        <span className='text-sm font-medium text-blue-900'>Step 3</span>
        <span className='text-xl font-semi-bold'>Schedule a time window that works for your busy life</span>
        <span className='mt-2 text-zinc-800'>Wait for me and my team to contact you during the timeslot you choose.</span>
      </div>
    </li>
  </ol>
  <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-6 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <Image 
              src='/repairguy.jpeg'
              alt='repair guy image'
              width={1200}
              height={1200}
              quality={100}
              className='rounded-md bg-[#9c9c9c] p-2 sm:p-4 md:p-20 shadow-2xl ring-1 ring-gray-950/75'
              />

            </div>
            </div>
        </div>
  <div className='mx-1 text-center p-2 text-sm font-black text-black'>Coming soon. Contact <span className='text-bold font font-medium text-blue-950'>williamsapplianceconsult@gmail.com or william@applianceconsults.com</span> with questions.</div>
</div>
    </main>
  );
}
