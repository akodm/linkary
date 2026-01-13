import { db } from '@/db';
import { api } from '@/db/schemas/api';
import { userApi } from '@/db/schemas/userApi';
import { sentryCaptureException } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

type Step = 'processing' | 'update-api-usage' | 'complete';

export async function GET(request: NextRequest) {
  let step: Step = 'processing';

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

    step = 'update-api-usage';

    await db.transaction(async (tx) => {
      await tx.update(api).set({ usage: 0 });
      await tx.update(userApi).set({ usage: 0 });
    });

    step = 'complete';

    return NextResponse.json(
      {
        data: true,
        message: `Monthly job completed successfully at step: ${step}`,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'cron', {
      message: `Monthly job failed at step: ${step}`,
    });

    return NextResponse.json(
      { data: step, message: `Monthly job failed at step: ${step}` },
      { status: 500 },
    );
  }
}
