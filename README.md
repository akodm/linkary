This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker 개발 환경

이 프로젝트는 Docker를 사용하여 개발 환경을 구성할 수 있습니다.

### 환경 변수 설정

프로젝트 루트에 `.env.development` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```bash
# .env.development 예시
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=your_database_url
```

### 기본 사용법

```bash
# 개발용 이미지 빌드
docker build -t linkary-dev .

# 개발용 컨테이너 실행 (기본: 3000:3000)
docker run -p 3000:3000 linkary-dev

# 다른 포트로 매핑 (예: 로컬 3333 → 컨테이너 3000)
docker run -p 3333:3000 linkary-dev
```

### 실시간 개발 (권장)

소스 코드 변경사항이 실시간으로 반영되도록 볼륨을 마운트하여 실행:

```bash
# 소스 코드를 볼륨으로 마운트하여 실시간 개발 (기본: 3000:3000)
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules linkary-dev

# 다른 포트로 매핑 (예: 로컬 3333 → 컨테이너 3000)
docker run -p 3333:3000 -v $(pwd):/app -v /app/node_modules linkary-dev
```

### Docker Compose 사용 (권장)

프로젝트 루트에 `docker-compose.yml` 파일이 포함되어 있어 더 간편하게 실행할 수 있습니다.

#### 실행 명령어

```bash
# 개발 환경 실행 (포트 3333으로 접속)
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down

# 이미지 재빌드 후 실행
docker-compose up --build
```

#### 접속 방법

- **로컬 포트**: `http://localhost:3333`
- **컨테이너 포트**: 3000 (내부)

#### 컨테이너 관리

```bash
# 특정 컨테이너만 중지
docker stop linkary-dev

# 특정 컨테이너만 제거
docker rm linkary-dev

# 이미지 확인
docker images | grep linkary-dev

# 컨테이너 상태 확인
docker ps | grep linkary-dev
```

#### 설정 변경

`docker-compose.yml`에서 포트를 변경하려면:

```yaml
ports:
  - '8080:3000' # 로컬 8080 포트로 변경
```

### 개발 환경 특징

- ✅ **핫 리로드** - 소스 코드 변경 시 자동 새로고침
- ✅ **볼륨 마운트** - 로컬 파일과 컨테이너 동기화
- ✅ **간단한 설정** - 개발에 필요한 최소한의 구성
- ✅ **일관된 환경** - 팀원 간 동일한 개발 환경
