'use server';

import { db } from '@/db';
import { users } from '@/db/schemas';
import { eq, isNull } from 'drizzle-orm';
import { Session } from 'next-auth';
import { getSession } from 'src/lib/actions/auth';

export const getUserAction = async (session: Session, slug: string) => {
  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq, and }) =>
      and(eq(u.email, session.user.email), isNull(u.deletedAt)),
    columns: {
      name: true,
      slug: true,
      email: true,
      banned: true,
      bannedReason: true,
      bannedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      userApis: {
        columns: {
          usage: true,
          cumulativeUsage: true,
        },
        with: {
          api: {
            columns: {
              name: true,
              usage: true,
              limit: true,
              initialDateType: true,
              initialDateValue: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }
  if (user.slug !== slug) {
    throw new Error('User is not authorized');
  }
  if (user.banned) {
    throw new Error(`User is banned: ${user.bannedReason}`);
  }

  return user;
};

export type GetUserActionResponse = Awaited<ReturnType<typeof getUserAction>>;

export const editUserAction = async (name: string) => {
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

  await db
    .update(users)
    .set({ name })
    .where(eq(users.email, session.user.email));

  return true;
};

export type EditUserActionResponse = Awaited<ReturnType<typeof editUserAction>>;

export const deleteUserAction = async () => {
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

  await db
    .update(users)
    .set({ deletedAt: new Date() })
    .where(eq(users.email, session.user.email));

  return true;
};

export type DeleteUserActionResponse = Awaited<
  ReturnType<typeof deleteUserAction>
>;
