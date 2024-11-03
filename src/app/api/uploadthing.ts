import {  getAuth } from '@clerk/nextjs/server'
import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/server";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url)
    })
    // uploadedApplianceData: f(["image", "video"])
    // // add find a way to protect with auth
    // .middleware(async({ req, res }) => {
    //   const {sessionClaims: {userId}, } = await auth();
    //   const { userId } = getAuth(req);
    // if(!userId)
    //   throw new UploadThingError('You must be logged in to upload.',)

//     return { userId: userId.id };
// })
    // .onUploadComplete((data) => console.log("file", data)),
    
    
} 
 
export type OurFileRouter = typeof ourFileRouter;