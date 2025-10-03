import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from 'src/db/schemas'; // ✅ 값으로 import (import type 금지)

const isProd = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

const postgresConfig = {
  ssl: isProd ? ('require' as const) : ('prefer' as const),
  max: isProd ? 1 : 10,
  idle_timeout: isProd ? 5 : 20,
  connect_timeout: 30,
  prepare: false,
  ...(isVercel && {
    max_lifetime: 60 * 30,
    transform: { undefined: null },
  }),
};

// ✅ 전역 캐시의 타입을 "스키마 기반"으로 고정
declare global {
  var __pg: ReturnType<typeof postgres> | undefined;

  var __db: PostgresJsDatabase<typeof schema> | undefined;
}

export const pg =
  global.__pg ?? postgres(process.env.DATABASE_URL!, postgresConfig);
export const db: PostgresJsDatabase<typeof schema> =
  global.__db ?? drizzle(pg, { schema }); // ✅ 스키마 전달

if (!isProd) {
  global.__pg = pg;
  global.__db = db;
}
