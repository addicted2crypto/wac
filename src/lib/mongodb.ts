import { MongoClient, MongoClientOptions, Db, GridFSBucket } from 'mongodb';




if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options: MongoClientOptions = {

};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;



if(process.env.NODE_ENV === 'development') {
  if(!global._mongoClientPromise) {
    console.log('Creating new MongoDB client (DEV mode)');
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  } else {
    console.log('Reusing existing MongoDB client (DEV mode)');
  }
  clientPromise = global._mongoClientPromise;
  
  //@add dont forget to change to prod before pushing live!
} else {
  console.log('Creating new MongoDB client (Production mode)');
  client = new MongoClient(uri);
  clientPromise = client.connect();
}


export async function connectToDatabase(): Promise<{client: MongoClient; db: Db }> {
  console.log('Connecting to database ...');
  // if (!clientPromise) {
  //   throw new Error('MongoDB client promise is not initialized');
  // }
  try {
    const client = await clientPromise;
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

