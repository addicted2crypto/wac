import { createUploadthing, type FileRouter } from "uploadthing/server";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url)
    }),
    uploadedApplianceData: f(["image", "video"])
    // add find a way to protect with auth
    // .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),

    
} 
 
export type OurFileRouter = typeof ourFileRouter;