import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function connectAndQuery() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database!");
    client.release();
  } catch (error) {
    console.error("Database connection/squery error:", error);
  }
}

await connectAndQuery();
export { pool };
