import { db } from '@/db';
import { api, link, linkSafety, userApi, users } from '@/db/schemas';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { autoSearchURL, scrapeURL, verifyURL } from 'src/lib/actions/url';

const { GOOGLE_API_ID = '1', TAVILY_API_ID = '2', BOT_SLUG = '' } = process.env;

export const setBotURL = async () => {
  const bot = await db.query.users.findFirst({
    where: eq(users.slug, BOT_SLUG),
    with: {
      userApis: true,
    },
  });

  if (!bot) {
    throw new Error('Bot not found');
  }

  const userApis = await db.query.userApi.findMany({
    where: and(
      inArray(userApi.apiId, [
        parseInt(GOOGLE_API_ID),
        parseInt(TAVILY_API_ID),
      ]),
      eq(userApi.userId, bot.id),
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

  if (googleApi.usage >= googleApi.api.limit && googleApi.api.limit !== -1) {
    throw new Error('Google API usage limit exceeded');
  }

  if (tavilyApi.usage >= tavilyApi.api.limit && tavilyApi.api.limit !== -1) {
    throw new Error('TAVILY API usage limit exceeded');
  }

  if (
    googleApi.usage >= googleApi.api.totalLimit &&
    googleApi.api.totalLimit !== -1
  ) {
    throw new Error('Google API total usage limit exceeded');
  }

  if (
    tavilyApi.usage >= tavilyApi.api.totalLimit &&
    tavilyApi.api.totalLimit !== -1
  ) {
    throw new Error('TAVILY API total usage limit exceeded');
  }

  // 1. TAVILY API 사용: 외부 추천 링크 받아오기
  const response = await autoSearchURL();

  // TAVILY API 사용량 업데이트
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
            eq(userApi.userId, bot.id),
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

  if (!response.results.length) {
    return { data: null, reason: 'not found search url' };
  }

  const [newLink] = response.results;

  const findDuplicateLink = await db.query.link.findFirst({
    where: eq(link.url, newLink.url),
  });

  if (findDuplicateLink) {
    return { data: null, reason: 'already added link' };
  }

  // 2. GOOGLE API 사용: URL 검증
  const threatTypes = await verifyURL(newLink.url);

  // GOOGLE API 사용량 업데이트
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
            eq(userApi.userId, bot.id),
            eq(userApi.apiId, parseInt(GOOGLE_API_ID)),
          ),
        ),
      tx
        .update(api)
        .set({
          usage: sql`${api.usage} + 1`,
        })
        .where(eq(api.id, parseInt(GOOGLE_API_ID))),
    ]);
  });

  if (threatTypes.length > 0) {
    return {
      data: null,
      reason: `unsafe url: ${newLink.url}, threat types: ${threatTypes.join(', ')}`,
    };
  }

  // 3. 스크래핑 (외부 라이브러리 사용, API 사용량 카운트 안 함)
  const { title, description, image } = await scrapeURL(newLink.url);

  // 4. 링크 생성 및 안전 상태 설정
  const [addLink] = await db
    .insert(link)
    .values({
      url: newLink.url,
      title,
      description,
      image: image.url,
      imageWidth: image.width,
      imageHeight: image.height,
      imageAspectRatio: image.aspectRatio,
      verified: true,
      shared: true,
      userId: bot.id,
    })
    .returning();

  await db.insert(linkSafety).values({
    userId: bot.id,
    linkId: addLink.id,
    safe: true,
  });

  return { data: addLink, reason: 'success' };
};

export type SetBotURLResponse = Awaited<ReturnType<typeof setBotURL>>;
