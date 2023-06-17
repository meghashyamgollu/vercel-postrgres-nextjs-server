import { createPool } from "@vercel/postgres";

const pool = createPool({
  connectionString: process.env.NEXT_PUBLIC_POSTGRES_URL,
});

export default pool;
