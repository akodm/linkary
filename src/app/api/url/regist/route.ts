import { db } from '@/db';
import { link } from '@/db/schemas';
import { InsertLink } from '@/db/schemas/link';
import { users } from '@/db/schemas/users';
import { getSession } from '@/lib/actions/auth';
import { sentryCaptureException } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import ogs from 'open-graph-scraper';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { url, folderId } = await req.json();

  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { data: null, error: 'User session is not found' },
        { status: 401 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { data: null, error: 'User not found' },
        { status: 403 },
      );
    }

    const urlObj = new URL(url);
    const data = {
      title: '',
      description: '',
      thumbnail: '',
      safe: true,
    };

    if (urlObj.protocol !== 'https:') {
      data.safe = false;
      return NextResponse.json({ data }, { status: 201 });
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

    if (error || !success) {
      data.safe = false;
      return NextResponse.json({ data }, { status: 201 });
    }

    data.title = ogTitle || urlObj.hostname;
    data.description = ogDescription || '';
    data.thumbnail = ogImage?.[0]?.url || '';

    const linkValues: InsertLink = {
      url,
      title: data.title,
      description: data.description,
      image: data.thumbnail,
      userId: user.id,
    };

    if (folderId) {
      const folder = await db.query.linkFolder.findFirst({
        where: (lf, { eq, and }) =>
          and(eq(lf.id, folderId), eq(lf.userId, user.id)),
      });

      if (folder) {
        linkValues.linkFolderId = folder.id;
      }
    }

    const [newLink] = await db.insert(link).values(linkValues).returning();

    return NextResponse.json({ data: newLink }, { status: 201 });
  } catch (err) {
    console.error('Failed to regist url');

    sentryCaptureException(err, 'registUrl', { url });

    return NextResponse.json(
      { data: null, error: 'Failed to regist url' },
      { status: 500 },
    );
  }
}

export type RegistUrlResponse = Awaited<ReturnType<typeof POST>>;
