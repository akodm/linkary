import { db } from '@/db';
import { api } from '@/db/schemas';
import { sentryCaptureException } from '@/lib/utils';
import { eq } from 'drizzle-orm';
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

  try {
    const urlObj = new URL(url);
    const data = { safe: true };

    const [verifyApi] = await db
      .select()
      .from(api)
      .where(eq(api.id, parseInt(process.env.GOOGLE_API_ID!)))
      .limit(1);

    if (!verifyApi) {
      throw new Error('Verify API not found');
    }

    if (verifyApi.limit !== -1 && verifyApi.usage >= verifyApi.limit) {
      return NextResponse.json(
        { data: null, error: 'Verify API limit reached' },
        { status: 200 },
      );
    }

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
  } catch (err) {
    console.error('Failed to verify url');

    sentryCaptureException(err, 'verifyUrl', { url });

    return NextResponse.json(
      { data: null, error: 'Failed to verify url' },
      { status: 500 },
    );
  }
}
