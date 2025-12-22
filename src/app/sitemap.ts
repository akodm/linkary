import { MetadataRoute } from 'next';
import { getLinksCommunity } from '@/lib/actions/link';

const { NEXT_PUBLIC_VERCEL_URL = '' } = process.env;
const baseUrl = NEXT_PUBLIC_VERCEL_URL;

const languages = ['ko', 'en', 'jp', 'cn'];

// 페이지당 아이템 수 (커뮤니티 페이지네이션)
const ITEMS_PER_PAGE = 30;

// 커뮤니티 페이지의 총 페이지 수 계산
async function getCommunityTotalPages(): Promise<number> {
  try {
    const { total } = await getLinksCommunity({
      page: 1,
      size: ITEMS_PER_PAGE,
    });
    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Failed to get community total pages:', error);
    return 1; // 기본값으로 1페이지만 반환
  }
}

// SEO 처리하는 정적 페이지들
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' }, // 메인
  { path: '/about', priority: 0.8, changefreq: 'weekly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const communityTotalPages = await getCommunityTotalPages();

  // 정적 페이지들 생성
  const staticUrls = languages.flatMap((lang) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${lang}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changefreq as
        | 'always'
        | 'hourly'
        | 'daily'
        | 'weekly'
        | 'monthly'
        | 'yearly'
        | 'never',
      priority: page.priority,
    })),
  );

  // 커뮤니티 메인 페이지
  const communityMainUrls = languages.map((lang) => ({
    url: `${baseUrl}/${lang}/community`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  // 커뮤니티 페이지네이션 페이지들
  const communityPageUrls = languages.flatMap((lang) =>
    Array.from({ length: communityTotalPages }, (_, i) => i + 1).map(
      (page) => ({
        url: `${baseUrl}/${lang}/community/${page}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: page === 1 ? 0.9 : 0.7, // 첫 페이지는 높은 우선순위
      }),
    ),
  );

  return [...staticUrls, ...communityMainUrls, ...communityPageUrls];
}
