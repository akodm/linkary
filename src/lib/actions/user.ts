'use server';

import { db } from '@/db';
import { users } from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { getSession } from 'src/lib/actions/auth';

export const getUserAction = async (slug: string) => {
  const session = await getSession();

  if (!session?.user?.email) {
    throw new Error('User session is not found');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
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

  return user;
};

export type GetUserActionResponse = Awaited<ReturnType<typeof getUserAction>>;

export const editUserAction = async () => {
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
};

export type EditUserActionResponse = Awaited<ReturnType<typeof editUserAction>>;

export const deleteUserAction = async () => {
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
};

export type DeleteUserActionResponse = Awaited<
  ReturnType<typeof deleteUserAction>
>;
