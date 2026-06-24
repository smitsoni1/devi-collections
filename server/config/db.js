import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';

  // If URI is still a placeholder, warn and skip — server stays alive
  if (!uri || uri.includes('<username>') || uri.includes('xxxxx')) {
    console.warn('⚠️  MONGO_URI not configured. Please update server/.env with your MongoDB Atlas connection string.');
    console.warn('⚠️  Server is running WITHOUT database — API calls will fail until MongoDB is connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 50,           // Maintain up to 50 socket connections
      minPoolSize: 10,           // Keep at least 10 sockets open
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,    // Close sockets after 45 seconds of inactivity
      family: 4                  // Use IPv4, skip trying IPv6
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('   Server continues running. Fix MONGO_URI in server/.env and restart.');
  }
};

export default connectDB;
