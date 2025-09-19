import { db } from '@/db';
import { users } from '@/db/schemas';
import { SelectUser } from '@/db/schemas/users';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { sentryCaptureException } from 'src/lib/utils';

export const getUserBySlug = cache(
  async (slug: string): Promise<SelectUser | null> => {
    try {
      // TODO: 로그인 한 본인 데이터에만 접근 가능하도록 처리

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.slug, slug))
        .limit(1);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (err) {
      console.error('Failed to get user by slug');

      sentryCaptureException(err, 'getUserBySlug', { slug });

      return null;
    }
  },
);
