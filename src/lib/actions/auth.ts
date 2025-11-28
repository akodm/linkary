'use server';

import { auth, signIn, signOut, unstable_update } from '@/auth';

export const signInWithGoogle = async (redirectTo: string) => {
  await signIn('google', { redirectTo });
};

export type SignInWithGoogleResponse = Awaited<
  ReturnType<typeof signInWithGoogle>
>;

export const signOutWithGoogle = async (redirectTo: string) => {
  await signOut({ redirectTo });
};

export type SignOutWithGoogleResponse = Awaited<
  ReturnType<typeof signOutWithGoogle>
>;

export { auth as getSession, unstable_update as updateSession };
