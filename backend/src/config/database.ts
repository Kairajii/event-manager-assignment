import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
      },
);

export const connectDB = async () => {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("Database connected successfully");
  } finally {
    client.release();
  }
};

export default pool;
