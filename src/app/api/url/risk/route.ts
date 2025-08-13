import { NextRequest, NextResponse } from 'next/server';

const { GOOGLE_API_KEY = '' } = process.env;

export const runtime = 'nodejs';

/**
 * TODO:
 * - 디비에 호출량 저장
 * - 10만회 이상 호출되지 않도록 안정권으로 최대 99,500회로 자체 리미트 처리
 */
export async function POST(req: NextRequest) {
  const { url } = await req.json();
  const urlObj = new URL(url);
  const data = { safe: true };

  if (urlObj.protocol !== 'https:') {
    data.safe = false;
    return NextResponse.json({ data }, { status: 200 });
  }

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

  if (threat?.threatTypes?.length) {
    data.safe = false;
    return NextResponse.json({ data }, { status: 200 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
