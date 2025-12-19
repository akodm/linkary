import CommunityLayout from '@/components/community/Layout';
import { getLinksCommunity } from '@/lib/actions/link';
import { notFound } from 'next/navigation';

// SSG + ISR: 빌드 타임에 정적 생성, 1시간마다 재검증
export const revalidate = 3600; // 1시간 (3600초)

// 빌드 타임에 모든 언어와 페이지를 정적으로 생성
export async function generateStaticParams() {
  const languages = ['ko', 'en', 'jp', 'cn'];
  const itemsPerPage = 30;

  // total 수 조회 (언어와 무관하므로 한 번만 조회)
  const { total } = await getLinksCommunity({ page: 1, size: itemsPerPage });
  const totalPages = Math.ceil(total / itemsPerPage);

  // 모든 언어와 페이지 조합 생성
  const params: Array<{ lang: string; page: string }> = [];

  for (const lang of languages) {
    for (let page = 1; page <= totalPages; page++) {
      params.push({ lang, page: String(page) });
    }
  }

  return params;
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}) {
  const { page } = await params;
  const currentPage = Number(page);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const { data, total } = await getLinksCommunity({
    page: currentPage,
    size: 30,
  });

  return <CommunityLayout links={data} total={total} />;
}
