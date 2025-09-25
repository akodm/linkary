import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db } from 'src/db';
import { users } from 'src/db/schemas';
import { sentryCaptureException } from 'src/lib/utils';

export const { auth, signIn, signOut, unstable_update, handlers } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth',
  },
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    signIn: async (params) => {
      if (!params?.user?.email) {
        return false;
      }

      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, params.user.email))
          .limit(1);

        if (user?.slug) {
          return `/user/${user.slug}`;
        }

        const [newUser] = await db
          .insert(users)
          .values({
            role: 'user',
            name: params.user.name || '',
            email: params.user.email || '',
            provider: 'google',
            providerId: params.user.id,
          })
          .returning();

        if (newUser?.slug) {
          return `/user/${newUser.slug}`;
        }

        return true;
      } catch (err) {
        console.error('Failed to sign up or sign in');

        sentryCaptureException(err, 'signIn', { params });

        return '/auth/exception?loginFailed=true';
      }
    },

    jwt: async ({ token }) => {
      return token;
    },
    session: async ({ session }) => {
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
