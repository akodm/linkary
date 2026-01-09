import { db } from '@/db';
import { users } from '@/db/schemas/users';
import { sentryCaptureException } from '@/lib/utils';
import { and, isNotNull, lte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (
      request.headers.get('Authorization') !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { data: null, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const deletedResult = await db
      .delete(users)
      .where(
        and(isNotNull(users.deletedAt), lte(users.deletedAt, threeMonthsAgo)),
      )
      .returning({ deletedId: users.id });

    if (deletedResult.length === 0) {
      return NextResponse.json(
        { data: null, message: 'No deleted users to clean up' },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        data: deletedResult.map((user) => user.deletedId),
        message: 'User deleted cron job completed successfully',
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'cron', {
      message: 'User deleted cron job failed',
    });

    return NextResponse.json(
      { data: false, message: 'User deleted cron job failed' },
      { status: 500 },
    );
  }
}
