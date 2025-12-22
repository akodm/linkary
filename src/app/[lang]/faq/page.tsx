import type { Metadata } from 'next';
import FaqLayout from '@/components/faq/Layout';

const { NEXT_PUBLIC_VERCEL_URL = '' } = process.env;

const getMetadata = async (lang: string): Promise<Metadata> => {
  const manifest = await import(`public/manifest-${lang}.json`);
  const baseUrl = NEXT_PUBLIC_VERCEL_URL;
  const currentUrl = `${baseUrl}/${lang}/faq`;

  const metadata: Record<
    string,
    {
      title: string;
      description: string;
      keywords: string[];
    }
  > = {
    ko: {
      title: '자주 묻는 질문 | Linkary',
      description:
        'Linkary에 대한 자주 묻는 질문을 확인하세요. 링크 관리, 안전성 검사, AI 추천, 공유 기능 등에 대한 답변을 찾아보세요.',
      keywords: [
        'FAQ',
        '자주 묻는 질문',
        '질문과 답변',
        '도움말',
        '가이드',
        '링크 관리 FAQ',
        'Linkary FAQ',
      ],
    },
    en: {
      title: 'FAQ | Linkary',
      description:
        'Check our frequently asked questions about Linkary. Find answers about link management, safety checks, AI recommendations, and sharing features.',
      keywords: [
        'FAQ',
        'frequently asked questions',
        'questions and answers',
        'help',
        'guide',
        'link management FAQ',
        'Linkary FAQ',
      ],
    },
    jp: {
      title: 'よくある質問 | Linkary',
      description:
        'Linkaryに関するよくある質問をご確認ください。リンク管理、安全性チェック、AI推奨、共有機能などに関する回答を見つけてください。',
      keywords: [
        'FAQ',
        'よくある質問',
        '質問と回答',
        'ヘルプ',
        'ガイド',
        'リンク管理FAQ',
        'Linkary FAQ',
      ],
    },
    cn: {
      title: '常见问题 | Linkary',
      description:
        '查看有关 Linkary 的常见问题。查找有关链接管理、安全检查、AI 推荐和共享功能的答案。',
      keywords: [
        'FAQ',
        '常见问题',
        '问答',
        '帮助',
        '指南',
        '链接管理FAQ',
        'Linkary FAQ',
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
        en: `${baseUrl}/en/faq`,
        ko: `${baseUrl}/ko/faq`,
        ja: `${baseUrl}/jp/faq`,
        zh: `${baseUrl}/cn/faq`,
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

export default function FaqPage() {
  return <FaqLayout />;
}
