import { db } from '@/db';
import { link, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { sentryCaptureException } from '@/lib/utils';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 사용자가 공유 URL 목록 조회
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || 1;
  const size = searchParams.get('size') || 10;

  try {
    const links = await db
      .select()
      .from(link)
      .where(and(eq(link.banned, false), eq(link.shared, true)))
      .orderBy(desc(link.createdAt))
      .offset((Number(page) - 1) * Number(size))
      .limit(Number(size));

    const [total] = await db
      .select({ count: count() })
      .from(link)
      .where(and(eq(link.banned, false), eq(link.shared, true)));

    return NextResponse.json(
      { data: links, total: total.count },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'linkListGet', { page, size });

    return NextResponse.json(
      { data: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export type LinkListGetResponse = Awaited<ReturnType<typeof GET>>;

/**
 * 조회 수 증가
 */
export async function PUT(request: NextRequest) {
  const body = await request.json();

  const { linkId } = body;

  const session = await getSession();

  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        { data: null, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { data: null, message: 'Logged in user not found' },
        { status: 403 },
      );
    }

    await db
      .update(link)
      .set({ view: sql`${link.view} + 1` })
      .where(eq(link.id, linkId));

    return NextResponse.json({ data: true }, { status: 200 });
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'linkViewUpdate', { session, linkId });

    return NextResponse.json(
      { data: false, message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
