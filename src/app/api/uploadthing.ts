
import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url)
    }),
//     uploadedApplianceData: f(["image", "video"])
    
//     .middleware(async (args) => {
//       const { req } = args;

    
//       // add find a way to protect with auth
//       const auth = getAuth(NextRequest);
//       const { userId } = getAuth();
//     if(!userId) {
//       throw new UploadThingError('You must be logged in to upload.',)
//   }
//     return { userId};
// })
    // .onUploadComplete((data) => console.log("Appliance file uploaded:", data)),
    
    
} 
 
export type OurFileRouter = typeof ourFileRouter;