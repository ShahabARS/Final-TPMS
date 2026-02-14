import mongoose from 'mongoose';

/**
 * Database Connection
 * 
 * Connects to MongoDB using the connection string from environment variables
 */
const connectDB = async ({ retries = 5, delayMs = 2000 } = {}) => {
  let attempt = 0;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in environment');
    // Do not attempt to connect if URI is missing
    return Promise.reject(new Error('MONGODB_URI not set'));
  }

  while (attempt < retries) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      attempt += 1;
      console.error(
        `MongoDB connection attempt ${attempt} failed: ${error.message}`
      );
      if (attempt >= retries) {
        console.error('Could not connect to MongoDB after retries');
        // In production you may want to exit; in development it's helpful to not crash immediately
        process.exit(1);
      }
      // Wait before retrying
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
};

export default connectDB;
