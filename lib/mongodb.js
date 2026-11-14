import { MongoClient } from 'mongodb';

// Standard Direct Replica Set URI (Bypasses Windows / ISP SRV DNS blocking completely)
export const DIRECT_URI = 'mongodb://khulnagazetteratul_db_user:H9HhIMNGaGphiB5i@ac-wfvd245-shard-00-00.xssno1i.mongodb.net:27017,ac-wfvd245-shard-00-01.xssno1i.mongodb.net:27017,ac-wfvd245-shard-00-02.xssno1i.mongodb.net:27017/khulnagazette?ssl=true&authSource=admin&replicaSet=atlas-zzji1t-shard-0';

// Wipe any stale cached promise from previous sessions
if (typeof global !== 'undefined') {
  delete global._mongoClientPromise;
}

const options = {};

let client;
let clientPromise;

export function getClientPromise() {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromiseDirect) {
      console.log('Connecting to MongoDB via Direct Replica Set URI...');
      client = new MongoClient(DIRECT_URI, options);
      global._mongoClientPromiseDirect = client.connect().catch((err) => {
        global._mongoClientPromiseDirect = null;
        console.error('MongoDB connection error:', err.message);
        throw err;
      });
    }
    return global._mongoClientPromiseDirect;
  } else {
    if (!clientPromise) {
      client = new MongoClient(DIRECT_URI, options);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export default getClientPromise();

export async function getDatabase(dbName = 'khulnagazette') {
  const promise = getClientPromise();
  const connectedClient = await promise;
  return connectedClient.db(dbName);
}
