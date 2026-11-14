import { MongoClient } from 'mongodb';

// Standard Direct Replica Set URI (Bypasses Windows / ISP SRV DNS blocking completely)
export const DIRECT_URI = 'mongodb://khulnagazetteratul_db_user:H9HhIMNGaGphiB5i@ac-wfvd245-shard-00-00.xssno1i.mongodb.net:27017,ac-wfvd245-shard-00-01.xssno1i.mongodb.net:27017,ac-wfvd245-shard-00-02.xssno1i.mongodb.net:27017/khulnagazette?ssl=true&authSource=admin&replicaSet=atlas-zzji1t-shard-0';

const uri = process.env.MONGODB_URI || DIRECT_URI;

const options = {
  serverSelectionTimeoutMS: 6000,
  connectTimeoutMS: 8000,
};

let client;
let clientPromise;

export function getClientPromise() {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromiseDirect) {
      client = new MongoClient(uri, options);
      global._mongoClientPromiseDirect = client.connect().catch((err) => {
        global._mongoClientPromiseDirect = null;
        console.error('MongoDB connection error:', err.message);
        throw err;
      });
    }
    return global._mongoClientPromiseDirect;
  } else {
    // In serverless / production (e.g. Vercel)
    if (!global._mongoClientPromiseProd) {
      client = new MongoClient(uri, options);
      global._mongoClientPromiseProd = client.connect().catch((err) => {
        global._mongoClientPromiseProd = null;
        console.error('MongoDB connection error (prod):', err.message);
        throw err;
      });
    }
    return global._mongoClientPromiseProd;
  }
}

export default getClientPromise();

export async function getDatabase(dbName = 'khulnagazette') {
  const promise = getClientPromise();
  const connectedClient = await promise;
  return connectedClient.db(dbName);
}
