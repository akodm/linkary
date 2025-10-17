import UserLayout from '@/components/user/Layout';
import { getSession } from '@/lib/actions/auth';
import { getUserAction } from '@/lib/actions/user';
import { sentryCaptureException } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UserSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getSession();

  try {
    if (!session) {
      throw new Error('User session is not found');
    }

    const user = await getUserAction(session, slug);

    if (!user) {
      throw new Error('User not found');
    }

    return <UserLayout user={user} recovery={session.recovery} />;
  } catch (err) {
    console.error('Failed to get user by slug');

    sentryCaptureException(err, 'getUserBySlugWithSession', { session, slug });

    notFound();
  }
}
