import type { Metadata } from 'next';
import AboutLayout from '@/components/about/Layout';

const { NEXT_PUBLIC_VERCEL_URL = '' } = process.env;

const getMetadata = async (lang: string): Promise<Metadata> => {
  const manifest = await import(`public/manifest-${lang}.json`);
  const baseUrl = NEXT_PUBLIC_VERCEL_URL;
  const currentUrl = `${baseUrl}/${lang}/about`;

  const metadata: Record<
    string,
    {
      title: string;
      description: string;
      keywords: string[];
    }
  > = {
    ko: {
      title: '소개 | Linkary',
      description:
        'Linkary는 링크를 편하게 관리하고, 신뢰할 수 있는 상태로 보관할 수 있는 스마트한 링크 관리 플랫폼입니다. 링크의 안전성을 검사하고 AI를 통해 추천받으며, 편리한 관리 및 공유 기능을 제공합니다.',
      keywords: [
        'Linkary 소개',
        '링크 관리 플랫폼',
        '링크 안전성 검사',
        'AI 링크 추천',
        '링크 공유',
        '북마크 관리',
        'Linkary 기능',
      ],
    },
    en: {
      title: 'About | Linkary',
      description:
        'Linkary is a smart link management platform that allows you to manage links with ease and keep them trustworthy. It checks link safety, provides AI-powered recommendations, and offers convenient management and sharing features.',
      keywords: [
        'About Linkary',
        'link management platform',
        'link safety check',
        'AI link recommendations',
        'link sharing',
        'bookmark management',
        'Linkary features',
      ],
    },
    jp: {
      title: '紹介 | Linkary',
      description:
        'Linkaryは、リンクを簡単に管理し、信頼性を保つことができるスマートなリンク管理プラットフォームです。リンクの安全性をチェックし、AIによる推奨を受け、便利な管理と共有機能を提供します。',
      keywords: [
        'Linkary紹介',
        'リンク管理プラットフォーム',
        'リンク安全性チェック',
        'AIリンク推奨',
        'リンク共有',
        'ブックマーク管理',
        'Linkary機能',
      ],
    },
    cn: {
      title: '关于 | Linkary',
      description:
        'Linkary 是一个智能链接管理平台，可让您轻松管理链接并保持其可信度。它检查链接安全性，提供 AI 驱动的推荐，并提供便捷的管理和共享功能。',
      keywords: [
        '关于 Linkary',
        '链接管理平台',
        '链接安全检查',
        'AI 链接推荐',
        '链接分享',
        '书签管理',
        'Linkary 功能',
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
          url: `${baseUrl}/introduction-banner.webp`,
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
      images: [`${baseUrl}/introduction-banner.webp`],
      creator: '@linkary_app',
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en/about`,
        ko: `${baseUrl}/ko/about`,
        ja: `${baseUrl}/jp/about`,
        zh: `${baseUrl}/cn/about`,
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

export default function AboutPage() {
  return <AboutLayout />;
}
