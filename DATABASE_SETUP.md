# 데이터베이스 설정 가이드

## 환경별 DATABASE_URL 설정

### 개발 환경 (.env.local)

```bash
# 로컬 PostgreSQL (포트 5432)
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# 또는 Supabase (포트 6543)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres"
```

### 프로덕션 환경 (Vercel)

```bash
# Vercel 대시보드에서 환경변수 설정
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres"
```

## Supabase 연결 정보 확인 방법

1. Supabase 대시보드 → Settings → Database
2. Connection string 복사
3. `[YOUR-PASSWORD]` 부분을 실제 비밀번호로 교체

## 포트 정보

- **로컬 PostgreSQL**: 5432
- **Supabase**: 6543 (SSL 필수)

## SSL 설정

- **개발 환경**: `ssl: 'prefer'` (SSL 사용 가능하면 사용)
- **프로덕션 환경**: `ssl: 'require'` (SSL 필수)
