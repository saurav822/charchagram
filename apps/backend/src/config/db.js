import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Reads MONGO_URI from the environment and throws a descriptive error at
 * startup if it is missing — preventing silent misconfiguration in production.
 *
 * @returns {string} The validated MongoDB connection string
 * @throws {Error} If MONGO_URI is not set
 */
function getMongoURI() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      '[db] MONGO_URI environment variable is not set.\n' +
      'Copy .env.example to .env in apps/backend/ and fill in your MongoDB Atlas connection string.'
    );
  }
  return uri;
}

const CLIENT_OPTIONS = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  connectTimeoutMS: 5_000,
};

/**
 * Establishes a Mongoose connection to MongoDB Atlas.
 * Validates the connection with a ping before resolving.
 *
 * Exits the process on failure so the container/orchestrator can restart
 * with corrected configuration rather than serving requests without a DB.
 *
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    const uri = getMongoURI();
    await mongoose.connect(uri, CLIENT_OPTIONS);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('[db] Connected to MongoDB Atlas successfully');
  } catch (err) {
    console.error('[db] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

export default connectDB;
