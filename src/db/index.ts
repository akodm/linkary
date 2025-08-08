import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schemas from '@/db/schemas';

const { DATABASE_URL = '' } = process.env;

config({ path: '.env.development' });

const client = postgres(DATABASE_URL);
export const db = drizzle({ client, schema: { ...schemas } });
