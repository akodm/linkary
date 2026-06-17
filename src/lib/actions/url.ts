import ogs from 'open-graph-scraper';
import { tavily } from '@tavily/core';
import { uploadImageToVercelBlob } from 'src/lib/utils.server';
import dayjs from 'dayjs';

const { TAVILY_API_KEY = '', GOOGLE_API_KEY = '' } = process.env;

const tvly = tavily({ apiKey: TAVILY_API_KEY });

export async function scrapeURL(url: string) {
  const urlObj = new URL(url);

  const { result, error } = await ogs({
    url,
    onlyGetOpenGraphInfo: true, // 오픈그래프 정보만 추출 (성능 최적화)
    urlValidatorSettings: {
      allow_fragments: true, // URL의 프래그먼트(#) 부분 허용
      allow_protocol_relative_urls: false, // 프로토콜 상대 URL(//example.com) 비허용
      allow_query_components: true, // 쿼리 파라미터(?key=value) 허용
      allow_trailing_dot: false, // 도메인 끝의 점(example.com.) 비허용
      allow_underscores: false, // 도메인에 언더스코어(example_com) 비허용
      protocols: ['https'], // 허용할 프로토콜 목록 (HTTPS만 허용)
      require_host: true, // 호스트명 필수
      require_port: false, // 포트 번호 필수 여부
      require_protocol: false, // 프로토콜 필수 여부 (false면 상대 URL 허용)
      require_tld: true, // 최상위 도메인(.com, .org 등) 필수
      require_valid_protocol: true, // 유효한 프로토콜 필수
      validate_length: true, // URL 길이 검증 (일반적으로 2048자 제한)
    },
  });

  const { success, ogTitle, ogDescription, ogImage } = result;

  if (error) {
    throw error;
  }
  if (!success) {
    throw new Error('Failed to scrape URL');
  }

  let image = {
    url: ogImage?.[0]?.url || '',
    width: 0,
    height: 0,
    aspectRatio: 0,
  };

  if (image.url) {
    image = await uploadImageToVercelBlob(image.url);
  }

  return {
    title: ogTitle || urlObj.hostname,
    description: ogDescription || '',
    image,
  };
}

export type ScrapeURLResponse = Awaited<ReturnType<typeof scrapeURL>>;

export async function verifyURL(url: string): Promise<string[]> {
  const params = new URLSearchParams();
  params.append('uri', url);
  params.append('threatTypes', 'MALWARE');
  params.append('threatTypes', 'SOCIAL_ENGINEERING');
  params.append('threatTypes', 'UNWANTED_SOFTWARE');
  params.append('key', GOOGLE_API_KEY);

  const response = await fetch(
    `https://webrisk.googleapis.com/v1/uris:search?${params.toString()}`,
    {
      method: 'GET',
    },
  );

  const { threat } = await response.json();

  return threat?.threatTypes || [];
}

export type VerifyURLResponse = Awaited<ReturnType<typeof verifyURL>>;

export async function recommendURL(prompt: string[]) {
  const parsePrompt = prompt.map((text, index) => {
    return `${index + 1}. ${text}`;
  });

  const response = await tvly.search(
    `
      Find sites that meet the following criteria:

      ${parsePrompt.join('\n')}

      Notes when browsing:
      - Focus on relevant news, official documentation, and technical blogs
      - Sites that meet the criteria and have a high level of accuracy
    `,
    {
      topic: 'general',
      searchDepth: 'advanced',
      maxResults: 3,
    },
  );

  return response;
}

interface Category {
  name: string;
  queries: string[]; // 같은 카테고리 내에서 랜덤 선택
  params: {
    topic: 'news' | 'general';
    timeRange?: 'day' | 'week' | 'month';
    days?: number;
    includeDomains?: string[];
    excludeDomains?: string[];
  };
}

const CATEGORIES: Category[] = [
  {
    name: 'tech-news',
    queries: [
      'AI agent framework release',
      'new developer tool launched',
      'open source project trending',
      'software engineering breakthrough',
    ],
    params: {
      topic: 'news',
      days: 3,
      includeDomains: [
        'techcrunch.com',
        'theverge.com',
        'arstechnica.com',
        'venturebeat.com',
        'news.ycombinator.com',
      ],
    },
  },
  {
    name: 'new-products',
    queries: [
      'new AI product launch',
      'indie hacker SaaS launched',
      'AI design tool released',
      'productivity app new launch',
    ],
    params: {
      topic: 'general',
      timeRange: 'week',
      includeDomains: [
        'producthunt.com',
        'indiehackers.com',
        'news.ycombinator.com',
      ],
    },
  },
  {
    name: 'hn-geek-style',
    queries: [
      'engineering deep dive system design',
      'database internals architecture',
      'AI infrastructure scaling',
      'developer experience tooling',
    ],
    params: {
      topic: 'general',
      timeRange: 'week',
      includeDomains: ['news.ycombinator.com', 'news.hada.io'],
    },
  },
  {
    name: 'self-dev',
    queries: [
      'software engineer career growth',
      'developer productivity deep work',
      'tech leadership lessons',
      'engineering manager advice',
    ],
    params: {
      topic: 'general',
      timeRange: 'month',
      includeDomains: [
        'lennysnewsletter.com',
        'newsletter.pragmaticengineer.com',
        'stratechery.com',
        'swyx.io',
      ],
    },
  },
];

// 공통 제외 도메인 (광고/SEO 어뷰징/저품질)
const GLOBAL_EXCLUDE = [
  'medium.com', // SEO 스팸 많음 (선택)
  'dev.to', // 마찬가지로 노이즈 많음 (선택)
  'geeksforgeeks.org',
  'w3schools.com',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function autoSearchURL() {
  // 1. 카테고리 랜덤 선택 (또는 라운드로빈)
  const category = pickRandom(CATEGORIES);
  const query = pickRandom(category.queries);

  // 2. Tavily 검색
  const response = await tvly.search(query, {
    topic: category.params.topic,
    searchDepth: 'basic', // basic이면 충분, 비용/속도 유리
    maxResults: 10, // 여러 개 받아서 그중 고르기
    ...(category.params.topic === 'news' && category.params.days
      ? {
          startDate: dayjs()
            .subtract(category.params.days, 'days')
            .format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
        }
      : {}),
    ...(category.params.timeRange
      ? { timeRange: category.params.timeRange }
      : {}),
    includeDomains: category.params.includeDomains,
    excludeDomains: [
      ...(category.params.excludeDomains ?? []),
      ...GLOBAL_EXCLUDE,
    ],
  });

  const top = response.results.sort((a, b) => b.score - a.score)[0];

  return {
    category: category.name,
    query,
    result: top,
  };
}
