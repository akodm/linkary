import { db } from '@/db';
import { userApi, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { sentryCaptureException } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 관리자가 사용자의 API 사용량 초기화
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { userId, apiId, cumulativeUsage } = body;

  const session = await getSession();

  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        { data: null, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return NextResponse.json(
        { data: null, message: 'User not found' },
        { status: 404 },
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { data: null, message: 'User is not admin' },
        { status: 403 },
      );
    }

    await db
      .update(userApi)
      .set({ usage: 0, cumulativeUsage })
      .where(and(eq(userApi.userId, userId), eq(userApi.apiId, apiId)));

    return NextResponse.json({ data: true }, { status: 200 });
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'adminUserApiInit', {
      session,
      userId,
      apiId,
      cumulativeUsage,
    });

    return NextResponse.json(
      { data: false, message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
