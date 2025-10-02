// db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const isProd = process.env.NODE_ENV === 'production';

// 개발(HMR) 중 중복 생성을 방지
const g = globalThis as unknown as {
  __pg?: ReturnType<typeof postgres>;
  __db?: ReturnType<typeof drizzle>;
};

export const pg =
  g.__pg ??
  postgres(process.env.DATABASE_URL!, {
    ssl: 'require',
    max: 3, // 서버리스라면 풀 크기는 작게
    idle_timeout: 5, // 유휴 연결 빨리 정리
    connect_timeout: 30,
    prepare: false, // (중요) 트랜잭션 풀링일 때 prepared stmt 비활성화
  });

export const db = g.__db ?? drizzle(pg);

if (!isProd) {
  g.__pg = pg;
  g.__db = db;
}
