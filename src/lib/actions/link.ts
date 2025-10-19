import { db } from '@/db';
import { getSession } from 'src/lib/actions/auth';
import { eq } from 'drizzle-orm';
import { link, linkReport, users } from '@/db/schemas';
import { scrapeURL } from 'src/lib/actions/url';
import { InsertLink } from '@/db/schemas/link';

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
