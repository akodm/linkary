import { db } from '@/db';
import { linkSafety, users } from '@/db/schemas';
import { desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { sentryCaptureException } from 'src/lib/utils';
import { getSession } from 'src/lib/actions/auth';

export const getUserBySlugWithSession = cache(async (slug: string) => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      throw new Error('User session is not found');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      with: {
        links: {
          with: {
            linkFolder: true,
            linkSafety: {
              orderBy: [desc(linkSafety.createdAt)],
              limit: 1,
            },
          },
        },
        userApis: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    if (user.slug !== slug) {
      throw new Error('User is not authorized');
    }

    return user;
  } catch (err) {
    console.error('Failed to get user by slug');

    sentryCaptureException(err, 'getUserBySlugWithSession', { slug });

    return null;
  }
});

export type GetUserBySlugWithSessionResponse = Awaited<
  ReturnType<typeof getUserBySlugWithSession>
>;
