import { db } from '@/db';
import { api } from '@/db/schemas/api';
import { userApi } from '@/db/schemas/userApi';
import { sentryCaptureException } from '@/lib/utils';
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

    await db.transaction(async (tx) => {
      await tx.update(api).set({ usage: 0 });
      await tx.update(userApi).set({ usage: 0 });
    });

    return NextResponse.json(
      {
        data: true,
        message: 'User API amount cron job completed successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    sentryCaptureException(error, 'cron', {
      message: 'User API amount cron job failed',
    });

    return NextResponse.json(
      { data: false, message: 'User API amount cron job failed' },
      { status: 500 },
    );
  }
}
