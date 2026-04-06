import { db } from '@/db';
import { users } from '@/db/schemas/users';
import { setBotURL } from '@/lib/actions/bot';
import { sentryCaptureException } from '@/lib/utils';
import { and, isNotNull, lte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

type Step = 'processing' | 'user-deleted' | 'auto-search' | 'complete';

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

    step = 'user-deleted';

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const deletedResult = await db
      .delete(users)
      .where(
        and(isNotNull(users.deletedAt), lte(users.deletedAt, threeMonthsAgo)),
      )
      .returning({ deletedId: users.id });

    if (deletedResult.length !== 0) {
      console.log(`Deleted ${deletedResult.length} users`);
    }

    step = 'auto-search';

    const botURL = await setBotURL();

    if (botURL.data) {
      console.log(`Added bot URL: ${botURL.data.url}`);
    } else {
      throw new Error(`Failed to add bot URL: ${botURL.reason}`);
    }

    step = 'complete';

    return NextResponse.json(
      {
        data: true,
        message: `Weekly job completed successfully at step: ${step}`,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'cron', {
      message: `Weekly job failed at step: ${step}`,
    });

    return NextResponse.json(
      { data: step, message: `Weekly job failed at step: ${step}` },
      { status: 500 },
    );
  }
}
