'use server';

import { db } from '@/db';
import { getSession } from 'src/lib/actions/auth';
import { and, count, desc, eq, isNull, sql } from 'drizzle-orm';
import {
  api,
  link,
  linkFolder,
  linkReport,
  linkSafety,
  userApi,
  users,
} from '@/db/schemas';
import { recommendURL, scrapeURL, verifyURL } from 'src/lib/actions/url';
import { InsertLink } from '@/db/schemas/link';

const { GOOGLE_API_ID = '1' } = process.env;

export const getLinkAndFolder = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('Logged in user not found');
  }

  const [links, folders] = await Promise.all([
    db.query.link.findMany({
      where: and(eq(link.userId, user.id), isNull(link.linkFolderId)),
      with: {
        linkReports: true,
        linkSafety: {
          orderBy: desc(linkSafety.createdAt),
        },
        linkViews: true,
      },
    }),
    db.query.linkFolder.findMany({
      where: eq(linkFolder.userId, user.id),
      with: {
        links: {
          with: {
            linkReports: true,
            linkSafety: {
              orderBy: desc(linkSafety.createdAt),
            },
            linkViews: true,
          },
        },
      },
    }),
  ]);

  return { links, folders };
};

export type LinkGetResponse = Awaited<ReturnType<typeof getLinkAndFolder>>;

export const getLinkAndFolderCommunity = async ({
  page = 1,
  size = 30,
}: {
  page?: number;
  size?: number;
}) => {
  const links = await db
    .select()
    .from(link)
    .where(and(eq(link.banned, false), eq(link.shared, true)))
    .orderBy(desc(link.createdAt))
    .offset((Number(page) - 1) * Number(size))
    .limit(Number(size));

  const [total] = await db
    .select({ count: count() })
    .from(link)
    .where(and(eq(link.banned, false), eq(link.shared, true)));

  return { data: links, total: total.count };
};

export type LinkAndFolderCommunityResponse = Awaited<
  ReturnType<typeof getLinkAndFolderCommunity>
>;

export const addLinkAction = async ({
  url,
  order,
  folderId,
}: {
  url: string;
  order?: number;
  folderId?: number;
}) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { title, description, image } = await scrapeURL(url);

  const [newLink] = await db
    .insert(link)
    .values({
      url,
      title,
      description,
      image: image.url,
      imageWidth: image.width,
      imageHeight: image.height,
      imageAspectRatio: image.aspectRatio,
      order,
      linkFolderId: folderId ?? null,
      userId: user.id,
    })
    .returning();

  return newLink;
};

export type AddLinkActionResponse = Awaited<ReturnType<typeof addLinkAction>>;

export const editLinkAction = async ({
  id,
  title,
  description,
  image,
  tags,
  order,
  folderId,
}: {
  id: number;
  title: string;
  description: string;
  image: string;
  tags?: string;
  order?: number;
  folderId?: number;
}) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const findLink = await db.query.link.findFirst({
    where: (l, { eq, and }) => and(eq(l.id, id), eq(l.userId, user.id)),
  });

  if (!findLink) {
    throw new Error('Link not found');
  }

  const values: InsertLink = {
    url: findLink.url,
    title,
    description,
    image,
    order,
    linkFolderId: folderId ?? null,
  };

  if (tags?.trim()) {
    const parseTags: string[] = JSON.parse(tags);

    if (parseTags.length) {
      values.tags = JSON.stringify(parseTags);
    } else {
      values.tags = '[]';
    }
  }

  const [updatedLink] = await db
    .update(link)
    .set(values)
    .where(eq(link.id, id))
    .returning();

  return updatedLink;
};

export type EditLinkActionResponse = Awaited<ReturnType<typeof editLinkAction>>;

export const deleteLinkAction = async ({ id }: { id: number }) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const findLink = await db.query.link.findFirst({
    where: (l, { eq, and }) => and(eq(l.id, id), eq(l.userId, user.id)),
  });

  if (!findLink) {
    throw new Error('Link not found');
  }

  await db.delete(link).where(eq(link.id, id));

  return true;
};

export type DeleteLinkActionResponse = Awaited<
  ReturnType<typeof deleteLinkAction>
>;

export const moveLinkAction = async ({
  id,
  folderId,
}: {
  id: number;
  folderId?: number;
}) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const findLink = await db.query.link.findFirst({
    where: (l, { eq, and }) => and(eq(l.id, id), eq(l.userId, user.id)),
  });

  if (!findLink) {
    throw new Error('Link not found');
  }

  const [updatedLink] = await db
    .update(link)
    .set({
      order: 0,
      linkFolderId: folderId ?? null,
    })
    .where(eq(link.id, id))
    .returning();

  return updatedLink;
};

export type MoveLinkActionResponse = Awaited<ReturnType<typeof moveLinkAction>>;

export const reportLinkAction = async ({
  id,
  reason,
}: {
  id: number;
  reason: string;
}) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!user) {
    throw new Error('User not found');
  }

  const findLink = await db.query.link.findFirst({
    where: eq(link.id, id),
  });

  if (!findLink) {
    throw new Error('Link not found');
  }

  await db.insert(linkReport).values({
    userId: user.id,
    linkId: id,
    reason,
  });

  return true;
};

export type ReportLinkActionResponse = Awaited<
  ReturnType<typeof reportLinkAction>
>;

export const verifyLinkAction = async ({ linkId }: { linkId?: number }) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  if (!linkId) {
    throw new Error('Link ID is required');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
    with: {
      userApis: {
        where: (u, { eq }) => eq(u.apiId, parseInt(GOOGLE_API_ID)),
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const findApi = await db.query.api.findFirst({
    where: eq(api.id, parseInt(GOOGLE_API_ID)),
  });

  if (!findApi) {
    throw new Error('API not found');
  }

  const findUserApi = user.userApis[0];

  if (!findUserApi) {
    throw new Error('User API not found');
  }

  if (findUserApi.usage >= findApi.limit && findApi.limit !== -1) {
    throw new Error('API usage limit exceeded');
  }

  if (findApi.usage >= findApi.totalLimit && findApi.totalLimit !== -1) {
    throw new Error('API total usage limit exceeded');
  }

  const findLink = await db.query.link.findFirst({
    where: eq(link.id, linkId),
  });

  if (!findLink) {
    throw new Error('Link not found');
  }

  const threatTypes = await verifyURL(findLink.url);
  let isSafe = true;

  if (threatTypes.length > 0) {
    isSafe = false;
  }

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
            eq(userApi.apiId, parseInt(GOOGLE_API_ID)),
          ),
        ),
      tx
        .update(api)
        .set({
          usage: sql`${api.usage} + 1`,
        })
        .where(eq(api.id, parseInt(GOOGLE_API_ID))),
      tx.insert(linkSafety).values({
        userId: user.id,
        linkId,
        safe: isSafe,
        reason: threatTypes.join(', ') || '',
      }),
      tx.update(link).set({
        verified: true,
      }),
    ]);
  });

  return threatTypes.length > 0;
};

export type VerifyLinkActionResponse = Awaited<
  ReturnType<typeof verifyLinkAction>
>;

export const recommendLinkAction = async ({ prompt }: { prompt: string[] }) => {
  const recommend = await recommendURL(prompt);

  return recommend;
};

export type RecommendLinkActionResponse = Awaited<
  ReturnType<typeof recommendLinkAction>
>;
