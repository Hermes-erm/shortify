import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
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
