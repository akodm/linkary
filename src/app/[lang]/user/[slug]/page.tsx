import UserLayout from '@/components/user/Layout';
import { getUserBySlug } from '@/lib/actions/user';
import { notFound } from 'next/navigation';

export default async function UserSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUserBySlug(slug);

  if (!user) {
    notFound();
  }

  return <UserLayout user={user} />;
}
