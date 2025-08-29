import mongoose from 'mongoose';
import { env } from './environment';

const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: '1' as const, strict: true, deprecationErrors: true },
};

export async function connectDb() {
  try {
    const uri = env.DATABASE_URL;
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().command({ ping: 1 });
    }
    console.log('Successfully connected to MongoDB!');
  } catch (error) {
    throw new Error(
      `Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function disconnectDb() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB!');
  } catch (error) {
    throw new Error(
      `Error disconnecting from MongoDB: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
