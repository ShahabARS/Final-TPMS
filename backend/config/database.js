import mongoose from 'mongoose';

/**
 * Database Connection
 * 
 * Connects to MongoDB using the connection string from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options are recommended for Mongoose 6+
      // useNewUrlParser and useUnifiedTopology are no longer needed
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit process if database connection fails
  }
};

export default connectDB;
