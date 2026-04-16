# Linkary

링크를 저장·공유하고, 안전성 검사·메타데이터 수집·AI 추천까지 한곳에서 다루는 웹 앱입니다. 무료로 운영하며, [Next.js](https://nextjs.org)로 만들고 [Vercel](https://vercel.com)에 올리고, 데이터는 [Supabase](https://supabase.com)를 씁니다.

**서비스:** [https://linkary-wheat.vercel.app/ko](https://linkary-wheat.vercel.app/ko)

**더 자세한 내용:** 기능·인프라·개발 정리는 [Notion 문서](https://better-battery-28a.notion.site/Linkary-With-Readdy-AI-246778df989880fe96e2f70a5234939f?pvs=74)에 있습니다.

## 무엇을 하나요

- **링크 저장·공유** — 개인 컬렉션과 공유 흐름
- **위협 검사** — Google Web Risk API 등으로 링크 안전성 확인
- **메타데이터·썸네일** — 제목·설명·썸네일 등 링크 정보 자동 수집
- **AI 링크 추천** — 프롬프트에 맞춰 추천 링크를 받는 흐름
- **커뮤니티** — 검증을 거친 링크를 공개 피드로 올리는 흐름 (아래 Cron·캐싱과 연결)

## 인증

별도 회원가입 없이 **Google 로그인**만 지원합니다. 부담을 줄이려는 선택입니다.

## PWA·다국어

**PWA**로 브라우저에서 앱처럼 설치할 수 있고, **여러 언어**를 지원합니다. 언어마다 UI뿐 아니라 웹 앱 매니페스트·메타데이터도 맞춰 두었습니다.

## 인프라와 배경 작업

Next.js·Vercel·Supabase 조합은 배포와 서버리스 작업을 단순하게 가져가기 위해서입니다. Supabase 무료 티어는 **일정 기간 DB 호출이 없으면 프로젝트가 잠시 멈출 수 있어**, **Vercel Cron**으로 **3일마다** 헬스체크 겸 내부 봇을 돌려 DB가 완전히 가만히 있지 않게 했습니다.

그 봇은 **AI 링크 추천**과 이어져, 미리 써 둔 프롬프트에 맞춰 추천 링크를 가져온 뒤 **위협 검사**를 합니다. 통과하면 **공유 처리**되어 커뮤니티에 올라갑니다.

## 커뮤니티 캐싱

트래픽이 많다고 가정하고, 커뮤니티 쪽은 **대략 1시간 단위**로 갱신되도록 ISR 재검증을 걸어 두었습니다.

## 모니터링·분석

[Vercel Runtime Logs](https://vercel.com/docs/logs/runtime)는 **보관 기간이 짧아** 장기적으로 에러를 추적하기엔 부족합니다. 그래서 **Sentry**를 붙여 에러·성능 기록을 더 오래 남깁니다.

방문·성능 지표는 기본적으로 **[Vercel Analytics](https://vercel.com/docs/analytics)**와 **[Speed Insights](https://vercel.com/docs/speed-insights)**를 쓰고, 필요하면 **Google Analytics**를 선택적으로 함께 씁니다.
