import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";

const db = drizzle(
    {
        connection: process.env.DATABASE_URL,
        casing: 'snake_case',
        logger: true
    }
)
export default db;