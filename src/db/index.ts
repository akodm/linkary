// db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schemas from '@/db/schemas';

const isProd = process.env.NODE_ENV === 'production';

// 전역 캐시 타입
declare global {
  var __pg__: ReturnType<typeof postgres> | undefined;

  var __db__: ReturnType<typeof drizzle> | undefined;
}

// 1) PG 클라이언트 싱글톤
const getPg = () => {
  if (!isProd && global.__pg__) return global.__pg__;

  const DATABASE_URL = process.env.DATABASE_URL!;
  const pg = postgres(DATABASE_URL, {
    max: isProd ? 10 : 1,
    idle_timeout: 20,
    connect_timeout: 10_000,
  });

  if (!isProd) global.__pg__ = pg;
  return pg;
};

// 2) Drizzle 싱글톤
export const db = (() => {
  if (!isProd && global.__db__) return global.__db__;
  const instance = drizzle(getPg(), { schema: { ...schemas } });
  if (!isProd) global.__db__ = instance;
  return instance;
})();
