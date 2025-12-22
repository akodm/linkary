import { MetadataRoute } from 'next';

const { NEXT_PUBLIC_VERCEL_URL = '' } = process.env;
const baseUrl = NEXT_PUBLIC_VERCEL_URL;

const languages = ['ko', 'en', 'jp', 'cn'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // SEO 처리하지 않는 페이지 차단
        disallow: [
          // 사용자 페이지
          ...languages.map((lang) => `/${lang}/user/`),
          // 인증 페이지
          ...languages.map((lang) => `/${lang}/auth/`),
          // API 및 관리자 페이지
          '/api/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
