// db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const isProd = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// 개발(HMR) 중 중복 생성을 방지
const g = globalThis as unknown as {
  __pg?: ReturnType<typeof postgres>;
  __db?: ReturnType<typeof drizzle>;
};

// 환경별 최적화된 설정
const postgresConfig = {
  // SSL 설정 (Supabase는 SSL 필수)
  ssl: isProd ? ('require' as const) : ('prefer' as const),

  // 연결 풀 설정
  max: isProd ? 1 : 10, // 프로덕션에서는 1개, 개발에서는 10개

  // 타임아웃 설정
  idle_timeout: isProd ? 5 : 20, // 프로덕션에서는 빠른 정리
  connect_timeout: 30,

  // Vercel 환경 특화 설정
  prepare: false, // Vercel에서 prepared statements 비활성화

  ...(isVercel && {
    // Vercel 특화 설정
    max_lifetime: 60 * 30, // 30분 후 연결 재생성
    transform: {
      undefined: null, // undefined를 null로 변환
    },
  }),
};

export const pg = g.__pg ?? postgres(process.env.DATABASE_URL!, postgresConfig);

export const db = g.__db ?? drizzle(pg);

if (!isProd) {
  g.__pg = pg;
  g.__db = db;
}
