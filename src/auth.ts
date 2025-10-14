import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from 'src/db';
import { users } from 'src/db/schemas';
import { generateName, sentryCaptureException } from '@/lib/utils';
import { ERROR_CODE } from 'src/consts/error-code';

export const { auth, signIn, signOut, unstable_update, handlers } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth',
  },
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    signIn: async (params) => {
      if (!params?.user?.email) {
        return '/auth/error?loginFailed=true';
      }

      return true;
    },
    jwt: async ({ token, user, account }) => {
      try {
        if (token.slug && token.role) {
          return token;
        }

        if (!token?.email) {
          token.error = ERROR_CODE.USER_EMAIL_NOT_FOUND;
          return token;
        }

        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email))
          .limit(1);

        if (dbUser?.slug) {
          token.slug = dbUser.slug;
          token.role = dbUser.role;

          return token;
        }

        const [newUser] = await db
          .insert(users)
          .values({
            role: 'user',
            name: token.name || '',
            email: token.email || generateName(),
            provider: account?.provider || 'google',
            providerId: account?.providerAccountId || '',
          })
          .returning();

        if (!newUser?.slug) {
          throw new Error('Failed to create new user');
        }

        token.slug = newUser.slug;
        token.role = newUser.role;

        return token;
      } catch (err) {
        console.error('Failed to jwt callback');

        sentryCaptureException(err, 'jwt', { token, user, account });

        token.error = ERROR_CODE.FAILED_TO_CREATE_USER;

        return token;
      }
    },
    session: async ({ session, token }) => {
      session.user.slug = token.slug;
      session.user.role = token.role;
      session.error = token.error;

      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          scope: 'email profile',
          access_type: 'offline',
          include_granted_scopes: true,
          response_type: 'code',
        },
      },
    }),
  ],
});
