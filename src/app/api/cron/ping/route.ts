import { db } from '@/db';
import { users } from '@/db/schemas';
import { sentryCaptureException } from '@/lib/utils';
import { desc } from 'drizzle-orm';
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

    const currentUsers = await db.query.users.findMany({
      orderBy: desc(users.id),
    });

    const userReports = currentUsers.map((user) => {
      return {
        id: user.id,
      };
    });

    return NextResponse.json(
      {
        data: userReports,
        message: '(Ping) User reports cron job completed successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    sentryCaptureException(error, 'cron', {
      message: '(Ping) User reports cron job failed',
    });

    return NextResponse.json(
      { data: false, message: '(Ping) User reports cron job failed' },
      { status: 500 },
    );
  }
}
