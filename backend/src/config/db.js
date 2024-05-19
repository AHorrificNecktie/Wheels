// src/config/db.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('The MONGODB_URI must be set in the environment variables.');
}

// The client will be reused across requests to avoid creating a new connection each time
let _client;

const client = new MongoClient(uri);

const connectToMongoDB = async () => {
  // Only connect if we haven't already
  if (!_client) {
    try {
      _client = await client.connect();
      console.log('Successfully connected to MongoDB.');
    } catch (error) {
      console.error('Failed to connect to MongoDB', error);
      process.exit(1); // Exit process with failure
    }
  }
  return client; // return the client directly
};

module.exports = connectToMongoDB;
