// utils/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Your MongoDB connection string.
if (!uri) {
  throw new Error('The MONGODB_URI environment variable must be defined.');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // If already connected, use the existing database connection
    return { client: cachedClient, db: cachedDb };
  }

  // If no connection exists, create a new one
  const client = new MongoClient(uri as string); // Assure TypeScript that uri is a string.
  await client.connect();
  const db = client.db('wheels'); // Replace 'yourDatabaseName' with your actual database name

  // Cache the database connection and return the connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
