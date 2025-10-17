import { db } from '@/db';
import { users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { sentryCaptureException } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 관리자가 사용자를 차단 처리
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { userId, bannedReason = '관리자 차단' } = body;

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

    if (user.role !== 'admin') {
      return NextResponse.json(
        { data: null, message: 'User is not admin' },
        { status: 403 },
      );
    }

    await db
      .update(users)
      .set({ banned: true, bannedReason, bannedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ data: true }, { status: 200 });
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'adminUserBan', { session, userId });

    return NextResponse.json(
      { data: false, message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
