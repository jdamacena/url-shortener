import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Reuse existing connection if still active
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  // (Re)create connection promise if none exists or if connection is not ready
  if (!cached.promise || mongoose.connection.readyState !== 1) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
