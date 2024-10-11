import { MongoClient, MongoClientOptions, Db } from 'mongodb';

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
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  } else {
    console.log('Reusing existing MongoDB client (DEV mode)');
  }
  clientPromise = global._mongoClientPromise;
  
  
} else {
  console.log('Creating new MongoDB client (Production mode)');
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}


export async function connectToDatabase(): Promise<{client: MongoClient; db: Db}> {
  console.log('Connecting to database ...');
  // if (!clientPromise) {
  //   throw new Error('MongoDB client promise is not initialized');
  // }
    const client = await clientPromise;
    console.log('Client connected successfully');
    const db = client.db('Imcounsulting');
    console.log('Database selected: ImCounsulting');
    return { client, db};
}

export default clientPromise;
//   const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
//   const db = client.db('Appliance_Consult').command({ ping: 1});
//   console.log('I pinged you for deployment. You have successfully connected to MongoDB finally!')
//   return { client, db };
// }