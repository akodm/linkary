import { NextRequest, NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  const urlObj = new URL(url);

  if (urlObj.protocol !== 'https:') {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

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
  const data = {
    title: '',
    description: '',
    thumbnail: '',
  };

  if (error || !success) {
    return NextResponse.json({ data }, { status: 201 });
  }

  data.title = ogTitle || urlObj.hostname;
  data.description = ogDescription || '';
  data.thumbnail = ogImage?.[0]?.url || '';

  return NextResponse.json({ data }, { status: 201 });
}
