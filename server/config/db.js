import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not set in environment variables');
    }
    
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (!process.env.VERCEL) {
      process.exit(1); // Only exit in local dev/standalone server
    }
    throw error;
  }
}
