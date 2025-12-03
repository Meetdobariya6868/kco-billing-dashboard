// server/src/config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Robust dotenv loader:
 * - First try: project-level .env at process.cwd() (works if you run from server/ or repo root)
 * - Second try: server/.env relative to this file (works if process.cwd() differs)
 * - Third try: fallback to default dotenv.config()
 */
function loadEnv() {
  const candidates = [
    path.resolve(process.cwd(), ".env"), // most common
    path.resolve(process.cwd(), "server", ".env"), // if run from repo root
    path.resolve(__dirname, "..", "..", ".env"), // relative to this file: server/.env
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      dotenv.config({ path: p });
      console.log("dotenv loaded from:", p);
      return;
    }
  }

  // fallback - will attempt to load from default locations
  dotenv.config();
  console.warn("dotenv: no .env found in expected locations; attempted default load");
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connect to MongoDB. In dev we avoid crashing if URI missing, but we print clear messages.
 */
export default async function connectDB() {
  if (!MONGODB_URI) {
    console.warn("⚠️  MONGODB_URI is not defined — skipping MongoDB connection (dev fallback).");
    return;
  }

  // remove deprecated options; mongoose v7 handles options itself
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // exit so you fix credentials quickly in dev
    process.exit(1);
  }
}
