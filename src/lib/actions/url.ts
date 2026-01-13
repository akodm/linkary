'use server';

import ogs from 'open-graph-scraper';
import { tavily } from '@tavily/core';
import { uploadImageToVercelBlob } from 'src/lib/utils';
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

export async function autoSearchURL() {
  const response = await tvly.search(
    `
      Please recommend links related to self-improvement, interesting services, culture, or philosophy
    `,
    {
      topic: 'general',
      searchDepth: 'advanced',
      maxResults: 1,
      startDate: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    },
  );

  return response;
}
