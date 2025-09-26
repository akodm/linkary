import { db } from '@/db';
import { users } from '@/db/schemas';
import { SelectUser } from '@/db/schemas/users';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { sentryCaptureException } from 'src/lib/utils';
import { getSession } from 'src/lib/actions/auth';

export const getUserBySlugWithSession = cache(
  async (slug: string): Promise<SelectUser | null> => {
    try {
      const session = await getSession();

      if (!session?.user?.email) {
        throw new Error('User session is not found');
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

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
  },
);
