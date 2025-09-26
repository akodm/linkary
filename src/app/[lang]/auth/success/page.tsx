import { getSession } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function AuthSuccessPage() {
  const session = await getSession();

  if (session?.error) {
    throw new Error(`Session error: ${session.error}`);
  }
  if (session?.user?.slug) {
    redirect(`/user/${session.user.slug}`);
  }

  throw new Error('Login failed');
}
