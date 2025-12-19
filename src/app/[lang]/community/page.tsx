import CommunityLayout from '@/components/community/Layout';

export default async function CommunityPage() {
  const response = await fetch(
    `${process.env.API_URL}/api/link?page=1&size=30`,
    {
      cache: 'force-cache',
      next: {
        revalidate: 3600,
        tags: ['community'],
      },
    },
  );
  const { data, total } = await response.json();

  return <CommunityLayout links={data ?? []} total={total ?? 0} />;
}
