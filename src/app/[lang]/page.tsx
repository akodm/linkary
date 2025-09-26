import { getSession } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import HomeLayout from 'src/components/home/Layout';

export default async function Home() {
  const session = await getSession();

  if (session?.user?.slug) {
    redirect(`/user/${session.user.slug}`);
  }

  return <HomeLayout />;
}
