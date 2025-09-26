'use server';

import { auth, signIn, signOut, unstable_update } from '@/auth';

export const signInWithGoogle = async () => {
  await signIn('google', { redirectTo: '/auth/success' });
};

export const signOutWithGoogle = async () => {
  await signOut({ redirectTo: '/' });
};

export { auth as getSession, unstable_update as updateSession };
