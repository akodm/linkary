import type { Metadata } from 'next';
import CommunityLayout from '@/components/community/Layout';

const { NEXT_PUBLIC_VERCEL_URL = '' } = process.env;

const getMetadata = async (lang: string): Promise<Metadata> => {
  const manifest = await import(`public/manifest-${lang}.json`);
  const baseUrl = NEXT_PUBLIC_VERCEL_URL;
  const currentUrl = `${baseUrl}/${lang}/community`;

  const metadata: Record<
    string,
    {
      title: string;
      description: string;
      keywords: string[];
    }
  > = {
    ko: {
      title: '커뮤니티 | Linkary',
      description:
        '다양한 검증된 링크를 탐색하세요. 커뮤니티에 게시된 목록은 매시간 새로고침됩니다. Linkary에서 신뢰할 수 있는 링크를 발견하고 공유하세요.',
      keywords: [
        '커뮤니티',
        '링크 공유',
        '검증된 링크',
        '링크 탐색',
        '공유 링크',
        '커뮤니티 링크',
        '링크 커뮤니티',
      ],
    },
    en: {
      title: 'Community | Linkary',
      description:
        'Explore a variety of verified links. The list posted in the community is refreshed every hour. Discover and share trustworthy links on Linkary.',
      keywords: [
        'community',
        'link sharing',
        'verified links',
        'link discovery',
        'shared links',
        'community links',
        'link community',
      ],
    },
    jp: {
      title: 'コミュニティ | Linkary',
      description:
        '様々な検証済みリンクを探索してください。コミュニティに投稿されたリストは1時間ごとに更新されます。Linkaryで信頼できるリンクを発見し、共有しましょう。',
      keywords: [
        'コミュニティ',
        'リンク共有',
        '検証済みリンク',
        'リンク探索',
        '共有リンク',
        'コミュニティリンク',
        'リンクコミュニティ',
      ],
    },
    cn: {
      title: '社区 | Linkary',
      description:
        '探索各种已验证的链接。社区中发布的列表每小时刷新一次。在 Linkary 上发现并分享值得信赖的链接。',
      keywords: [
        '社区',
        '链接分享',
        '已验证链接',
        '链接发现',
        '共享链接',
        '社区链接',
        '链接社区',
      ],
    },
  };

  const pageMeta = metadata[lang as keyof typeof metadata] || metadata.en;

  return {
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: [...manifest.keywords, ...pageMeta.keywords],
    openGraph: {
      type: 'website',
      locale: lang,
      url: currentUrl,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: manifest.name,
      images: [
        {
          url: `${baseUrl}/main-banner.webp`,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      images: [`${baseUrl}/main-banner.webp`],
      creator: '@linkary_app',
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en/community`,
        ko: `${baseUrl}/ko/community`,
        ja: `${baseUrl}/jp/community`,
        zh: `${baseUrl}/cn/community`,
      },
    },
  };
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> => {
  const { lang } = await params;
  return getMetadata(lang);
};

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
