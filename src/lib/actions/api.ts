'use server';

import { db } from '@/db';
import { userApi } from '@/db/schemas';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { getSession } from 'src/lib/actions/auth';

const { GOOGLE_API_ID = '1', TAVILY_API_ID = '2' } = process.env;

export const getApiLimitAction = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq, and }) =>
      and(eq(u.email, session.user.email), isNull(u.deletedAt)),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const userApis = await db.query.userApi.findMany({
    where: and(
      inArray(userApi.apiId, [
        parseInt(GOOGLE_API_ID),
        parseInt(TAVILY_API_ID),
      ]),
      eq(userApi.userId, user.id),
    ),
    with: {
      api: true,
    },
  });

  const googleApi = userApis.find(
    ({ api }) => api.id === parseInt(GOOGLE_API_ID),
  );
  const tavilyApi = userApis.find(
    ({ api }) => api.id === parseInt(TAVILY_API_ID),
  );

  if (!googleApi || !tavilyApi) {
    throw new Error('API not found');
  }

  return {
    googleApi: {
      usage: googleApi.usage,
      limit: googleApi.api.limit,
    },
    tavilyApi: {
      usage: tavilyApi.usage,
      limit: tavilyApi.api.limit,
    },
  };
};

export type GetApiLimitActionResponse = Awaited<
  ReturnType<typeof getApiLimitAction>
>;
