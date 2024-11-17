import { MongoClient, MongoClientOptions, Db, GridFSBucket, DropDatabaseOptions } from 'mongodb';


type UploadThingConfig = {
  bucketName: string;
  uri: string;
}
// const uri = process.env.MONGODB_URI;
const client =  new MongoClient('process.env.MONGO_URI');
let dbConnection: Db;
let clientPromise: Promise<MongoClient>;


// const clientOptions: MongoClientOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// const uri: string = process.env.MONGODB_URI;
// const options: MongoClientOptions = {

// };

const uploadThingConfig: UploadThingConfig = {
  bucketName: 'WAC',
  uri: 'https://api.uploadthing.com/v1/upload',
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}



const createClientOptions = () => {
  const uploadthingToken = process.env.UPLOADTHING_TOKEN as string;
  return {
    auth: {
      username: 'api',
      password: uploadthingToken,
    },
  }
};


// if(process.env.NODE_ENV === 'development') {
//   if(!global._mongoClientPromise) {
//     console.log('Creating new MongoDB client (DEV mode)');
//     client = new MongoClient(uploadThingConfig.uri, createClientOptions());
  
//     global._mongoClientPromise = client.connect();
//   } else {
//     console.log('Reusing existing MongoDB client (DEV mode)');
//   }
//   clientPromise = global._mongoClientPromise;
  
//   //@add dont forget to change to prod before pushing live!
// } else {
//   console.log('Creating new MongoDB client (Production mode)');
//   client = new MongoClient(uploadThingConfig.uri, createClientOptions());
//   clientPromise = client.connect();
// }


export async function connectToDatabase(): Promise<{client: MongoClient; db: Db }> {
  console.log('Connecting to database ...');
  // const client = new MongoClient(process.env.MONGODB_URI!)

  await client.connect();





  try {
    await client.connect();
    console.log('Client connected successfully');

    if(!client) {
      throw new Error('Failed to connect to MongDB client in mongodb.ts')

    }
    const dbName = 'ImCounsulting';
    const db = client.db(dbName);

    if(!db) {
      throw new Error(`Failed to select database ${dbName}`);
    }

    console.log(`Database selected: ${dbName}`);
    // return { client, db }
    return { client, db };

} catch (error: any) {
  console.error('Error connecting to MongoDB:', error.message);
  throw error;
}
}

export async function insertIssue(db: Db,issueData: any) {
  const issues = db.collection('ImCounsulting');
  try {
    // const result = await issues.insertOne(issueData);
    // console.log('Saved to MongoDB', result.insertedId);
    // return result;
    await issues.insertOne(issueData);
    console.log('Saved to MongoDB successfully');
  } catch (error) {
    console.error('Error inserting issue into MongoDB:');
    throw error;
  }
}

export async function uploadFileToMongoDB(fileBuffer: Buffer, filename: string) {
  const bucket = new GridFSBucket(dbConnection);
  
  try {
  const uploadStream = bucket.openUploadStream(filename);

    await new Promise((resolve, reject) => {
      uploadStream.write(fileBuffer);
      uploadStream.end();

      uploadStream.on('error', (err) => {
        console.error(`Error uploading file: ${filename}`, err);
        reject(err);
    
      });
      uploadStream.on('finish', () => {
        resolve('finish');
      });
    });
    console.log(`File uploaded successfully: ${filename}`);
  } catch (error) {
    console.error(`Error uploading file: ${filename}`, error);
    throw error
  }

}


