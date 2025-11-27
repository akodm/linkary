import { db } from '@/db';
import { api, userApi, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { verifyURL } from '@/lib/actions/url';
import { sentryCaptureException } from '@/lib/utils';
import { and, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';

/**
 * 사용자가 URL을 검증 요청
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { url, apiId } = body;

  const session = await getSession();

  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        { data: [], message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const verification = await checkBotId();

    if (verification.isBot) {
      return NextResponse.json(
        { data: [], message: 'Access denied' },
        { status: 403 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      with: {
        userApis: {
          where: (u, { eq }) => eq(u.apiId, apiId),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { data: [], message: 'User not found' },
        { status: 403 },
      );
    }

    const findApi = await db.query.api.findFirst({
      where: eq(api.id, apiId),
    });

    if (!findApi) {
      return NextResponse.json(
        { data: [], message: 'API not found' },
        { status: 404 },
      );
    }

    const findUserApi = user.userApis[0];

    if (!findUserApi) {
      return NextResponse.json(
        { data: [], message: 'User API not found' },
        { status: 404 },
      );
    }

    if (findUserApi.usage >= findApi.limit && findApi.limit !== -1) {
      return NextResponse.json(
        { data: [], message: 'API usage limit exceeded' },
        { status: 403 },
      );
    }

    if (findApi.usage >= findApi.totalLimit && findApi.totalLimit !== -1) {
      return NextResponse.json(
        { data: [], message: 'API total usage limit exceeded' },
        { status: 403 },
      );
    }

    const threatTypes = await verifyURL(url);

    await db
      .update(userApi)
      .set({
        usage: sql`${userApi.usage} + 1`,
        cumulativeUsage: sql`${userApi.cumulativeUsage} + 1`,
      })
      .where(and(eq(userApi.userId, user.id), eq(userApi.apiId, apiId)));

    return NextResponse.json({ data: threatTypes }, { status: 200 });
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'linkVerify', { session, url, apiId });

    return NextResponse.json(
      { data: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
