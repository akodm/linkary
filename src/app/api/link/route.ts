import { db } from '@/db';
import { link, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { sentryCaptureException } from '@/lib/utils';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

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
