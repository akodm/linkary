'use server';

import { db } from '@/db';
import { getSession } from 'src/lib/actions/auth';
import { and, count, desc, eq, isNull } from 'drizzle-orm';
import { link, linkFolder, linkReport, users } from '@/db/schemas';
import { scrapeURL } from 'src/lib/actions/url';
import { InsertLink } from '@/db/schemas/link';
import { checkBotId } from 'botid/server';

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
        linkSafety: true,
        linkViews: true,
      },
    }),
    db.query.linkFolder.findMany({
      where: eq(linkFolder.userId, user.id),
      with: {
        links: {
          with: {
            linkReports: true,
            linkSafety: true,
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

  const verification = await checkBotId();

  if (verification.isBot) {
    throw new Error('Access denied');
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
      image,
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
