import CommunityLayout from '@/components/community/Layout';
import { notFound } from 'next/navigation';

export default async function CommunityPageByPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const currentPage = Number(page);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const response = await fetch(
    `${process.env.API_URL}/api/link?page=${currentPage}&size=30`,
    {
      cache: 'force-cache',
      next: {
        revalidate: 3600,
        tags: ['community-page'],
      },
    },
  );
  const { data, total } = await response.json();

  return <CommunityLayout links={data ?? []} total={total ?? 0} />;
}
