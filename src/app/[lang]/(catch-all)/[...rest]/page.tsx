import type { Metadata } from 'next';
import NotFoundLayout from '@/components/not-found/Layout';

const getMetadata = async (lang: string): Promise<Metadata> => {
  const titles: Record<string, string> = {
    ko: '페이지를 찾을 수 없습니다 | Linkary',
    en: 'Page Not Found | Linkary',
    jp: 'ページが見つかりません | Linkary',
    cn: '页面未找到 | Linkary',
  };

  return {
    title: titles[lang] || titles.en,
    robots: {
      index: false,
      follow: false,
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

export default function CatchAllPage() {
  return <NotFoundLayout />;
}
