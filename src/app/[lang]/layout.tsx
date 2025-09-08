import type { Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Geist, Geist_Mono } from 'next/font/google';
import 'src/css/globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { allMessages } from 'src/appRouterI18n';
import { LinguiClientProvider } from 'src/components/LinguiClientProvider';

const {
  NEXT_PUBLIC_GA_TAG = '',
  NEXT_PUBLIC_BASE_URL = '',
  NEXT_PUBLIC_VERCEL_URL = '',
  NEXT_PUBLIC_GOOGLE_VERIFICATION = '',
  NEXT_PUBLIC_NAVER_VERIFICATION = '',
} = process.env;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const generateMetadata = async ({
  params,
}: Readonly<{
  children: React.ReactNode;
  intercept: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) => {
  const { lang } = await params;
  const manifest = await import(`public/manifest-${lang}.json`);

  const baseUrl = NEXT_PUBLIC_BASE_URL || NEXT_PUBLIC_VERCEL_URL;
  const currentUrl = `${baseUrl}/${lang}`;

  return {
    title: {
      default: manifest.name,
      template: `%s | ${manifest.name}`,
    },
    description: manifest.description,
    keywords: [
      'link management',
      'bookmark manager',
      'link organizer',
      'team collaboration',
      'link sharing',
      'productivity tool',
      'web bookmarks',
      'URL manager',
      'link collection',
      'bookmark organizer',
    ],
    authors: [{ name: 'Linkary Team' }],
    creator: 'Linkary',
    publisher: 'Linkary',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang,
      url: currentUrl,
      title: manifest.name,
      description: manifest.description,
      siteName: manifest.name,
      images: [
        {
          url: `${baseUrl}/main-banner.webp`,
          width: 1200,
          height: 630,
          alt: `${manifest.name} - Smart Link Management Platform`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: manifest.name,
      description: manifest.description,
      images: [`${baseUrl}/main-banner.webp`],
      creator: '@linkary_app',
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        ko: `${baseUrl}/ko`,
        ja: `${baseUrl}/jp`,
        zh: `${baseUrl}/cn`,
        es: `${baseUrl}/es`,
      },
    },
    verification: {
      google: NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: {
        'naver-site-verification': NEXT_PUBLIC_NAVER_VERIFICATION || '',
      },
    },
    category: 'productivity',
    classification: 'Business',
    favicon: '/favicon.ico',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        {
          url: '/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      shortcut: '/favicon.ico',
    },
    manifest: `/manifest-${lang}.json`,
    appleWebApp: {
      title: manifest.name,
      capable: true,
      statusBarStyle: 'default',
      startUpImage: '/icons/icon-512x512.png',
    },
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'theme-color': '#000000',
      'msapplication-TileColor': '#000000',
      'msapplication-config': '/browserconfig.xml',
    },
  };
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
  intercept,
  params,
}: Readonly<{
  children: React.ReactNode;
  intercept: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const manifest = await import(`public/manifest-${lang}.json`);
  const baseUrl = NEXT_PUBLIC_BASE_URL || NEXT_PUBLIC_VERCEL_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: manifest.name,
    description: manifest.description,
    url: `${baseUrl}/${lang}`,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'Linkary Team',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Linkary',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/icon-512x512.png`,
      },
    },
    inLanguage: lang,
    potentialAction: {
      '@type': 'UseAction',
      target: `${baseUrl}/${lang}`,
    },
    featureList: [
      'Smart Link Management',
      'Automatic Thumbnail Generation',
      'Threat Link Check',
      'AI Link Recommendations',
      'Team Collaboration',
      'Multi-language Support',
    ],
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="manifest" href={`/manifest-${lang}.json`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link
          rel="preload"
          href="/main-banner.webp"
          as="image"
          type="image/webp"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
        <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <LinguiClientProvider
          initialLocale={lang}
          initialMessages={allMessages[lang]}
        >
          {children}
          {intercept}
          <SpeedInsights />
          {NEXT_PUBLIC_GA_TAG && (
            <Script id="ga-stub" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${NEXT_PUBLIC_GA_TAG}', {
                  page_title: document.title,
                  page_location: window.location.href,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
              `}
            </Script>
          )}
          <Analytics />
        </LinguiClientProvider>
      </body>
      {NEXT_PUBLIC_GA_TAG && <GoogleAnalytics gaId={NEXT_PUBLIC_GA_TAG} />}
    </html>
  );
}
