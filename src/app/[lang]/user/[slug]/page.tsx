import UserLayout from '@/components/user/Layout';
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

  try {
    const user = await getUserAction(slug);

    if (!user) {
      throw new Error('User not found');
    }

    return <UserLayout user={user} />;
  } catch (err) {
    console.error('Failed to get user by slug');

    sentryCaptureException(err, 'getUserBySlugWithSession', { slug });

    notFound();
  }
}
