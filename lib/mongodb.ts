import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Cache global agar tidak buka koneksi baru setiap request
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Jika sudah ada koneksi, langsung pakai
  if (cached.conn) return cached.conn;

  // Jika belum, buat koneksi baru
  if (!cached.promise) {
    const opts = {
      // bufferEvents: false,  <-- SUDAH DIHAPUS
      maxPoolSize: 10, // Batasi pool agar tidak overload
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000, // Timeout 5 detik
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise jika koneksi gagal agar bisa dicoba lagi
    throw e;
  }

  return cached.conn;
}

export default dbConnect;