import { env } from "@/data/env/server"
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema"

export const db2 = drizzle({
    schema,
    mode: "default",
    connection: {
        password: env.DB_PASSWORD,
        user: env.DB_USER,
        database: env.DB_NAME,
        host: env.DB_HOST,
    },
})