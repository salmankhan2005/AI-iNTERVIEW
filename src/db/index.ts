import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

const pool = new Pool({ connectionString: import.meta.env.VITE_DATABASE_URL });
export const db = drizzle(pool, { schema });
