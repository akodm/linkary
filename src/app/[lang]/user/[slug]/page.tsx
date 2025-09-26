import UserLayout from '@/components/user/Layout';
import { getUserBySlugWithSession } from '@/lib/actions/user';
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

  const user = await getUserBySlugWithSession(slug);

  if (!user) {
    notFound();
  }

  return <UserLayout user={user} />;
}
