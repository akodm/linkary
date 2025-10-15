'use server';

import { auth, signIn, signOut, unstable_update } from '@/auth';

export const signInWithGoogle = async () => {
  await signIn('google', { redirectTo: '/auth/success' });
};

export type SignInWithGoogleResponse = Awaited<
  ReturnType<typeof signInWithGoogle>
>;

export const signOutWithGoogle = async () => {
  await signOut({ redirectTo: '/' });
};

export type SignOutWithGoogleResponse = Awaited<
  ReturnType<typeof signOutWithGoogle>
>;

export { auth as getSession, unstable_update as updateSession };
