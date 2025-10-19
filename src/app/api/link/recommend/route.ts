import { db } from '@/db';
import { api, userApi, users } from '@/db/schemas';
import { getSession } from '@/lib/actions/auth';
import { recommendURL } from '@/lib/actions/url';
import { sentryCaptureException } from '@/lib/utils';
import { and, eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const { TAVILY_API_ID = '' } = process.env;

/**
 * 사용자가 URL을 추천 요청
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const { prompt } = body;

  const session = await getSession();

  try {
    if (!session?.user?.email) {
      return NextResponse.json(
        { data: [], message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      with: {
        userApis: {
          where: (u, { eq }) => eq(u.apiId, parseInt(TAVILY_API_ID)),
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
      where: eq(api.id, parseInt(TAVILY_API_ID)),
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

    const parsePrompt: string[] = JSON.parse(prompt);

    const response = await recommendURL(parsePrompt);

    await db.transaction(async (tx) => {
      await Promise.all([
        tx
          .update(userApi)
          .set({
            usage: sql`${userApi.usage} + 1`,
            cumulativeUsage: sql`${userApi.cumulativeUsage} + 1`,
          })
          .where(
            and(
              eq(userApi.userId, user.id),
              eq(userApi.apiId, parseInt(TAVILY_API_ID)),
            ),
          ),
        tx
          .update(api)
          .set({
            usage: sql`${api.usage} + 1`,
          })
          .where(eq(api.id, parseInt(TAVILY_API_ID))),
      ]);
    });

    return NextResponse.json({ data: response.results }, { status: 200 });
  } catch (err) {
    console.error(err);

    sentryCaptureException(err, 'linkRecommend', { session, prompt });

    return NextResponse.json(
      { data: [], message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
