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

## 모니터링 및 분석

이 프로젝트는 Sentry와 Google Analytics를 통합하여 에러 모니터링과 사용자 분석을 제공합니다.

### Sentry 설정

Sentry는 애플리케이션의 에러를 실시간으로 모니터링하고 추적합니다.

#### 환경 변수 설정

```bash
# .env.development 또는 .env.production
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project
SENTRY_ORG=your_organization
SENTRY_PROJECT=your_project
```

#### 사용법

```typescript
import * as Sentry from '@sentry/nextjs';

// 에러 발생 시 Sentry로 전송
try {
  // 위험한 코드
} catch (error) {
  Sentry.captureException(error);
}

// 커스텀 에러 발생
throw new Error('사용자 정의 에러 메시지');

// 성능 측정
Sentry.startSpan(
  {
    name: '사용자 액션',
    op: 'user.action',
  },
  async () => {
    // 측정할 작업
  },
);
```

### Google Analytics 설정

Google Analytics를 통해 사용자 행동과 웹사이트 성능을 분석할 수 있습니다.

#### 환경 변수 설정

```bash
# .env.development 또는 .env.production
NEXT_PUBLIC_GA_TAG=G-XXXXXXXXXX
```

#### 자동 추적

- ✅ **페이지 뷰** - 자동으로 페이지 방문 추적
- ✅ **사용자 세션** - 사용자별 세션 정보 수집
- ✅ **성능 메트릭** - Core Web Vitals 자동 수집

#### 커스텀 이벤트 추적

```typescript
// 커스텀 이벤트 전송
gtag('event', 'button_click', {
  event_category: 'engagement',
  event_label: 'signup_button',
  value: 1,
});

// 사용자 속성 설정
gtag('config', 'G-XXXXXXXXXX', {
  custom_map: {
    custom_parameter: 'custom_value',
  },
});
```

### 모니터링 대시보드

- **Sentry**: [https://sentry.io](https://sentry.io) - 에러 및 성능 모니터링
- **Google Analytics**: [https://analytics.google.com](https://analytics.google.com) - 사용자 행동 분석
