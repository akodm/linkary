import type { Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Geist, Geist_Mono } from 'next/font/google';
import 'src/css/globals.css';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { allMessages } from 'src/appRouterI18n';
import { LinguiClientProvider } from 'src/components/LinguiClientProvider';

const { NEXT_PUBLIC_GA_TAG = '' } = process.env;

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

  return {
    title: manifest.name,
    description: manifest.description,
    favicon: '/favicon.ico',
    icons: {
      icon: '/favicon.ico',
      apple: '/icons/apple-touch-icon.png',
    },
    appleWebApp: {
      title: manifest.name,
      capable: true,
      statusBarStyle: 'default',
    },
    formatDetection: {
      telephone: false,
    },
  };
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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

  return (
    <html lang={lang}>
      <head>
        <link rel="manifest" href={`/manifest-${lang}.json`} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LinguiClientProvider
          initialLocale={lang}
          initialMessages={allMessages[lang]}
        >
          {children}
          {intercept}
          <SpeedInsights />
          <Script id="ga-stub" strategy="beforeInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${NEXT_PUBLIC_GA_TAG}');
              `}
          </Script>
          <Analytics />
        </LinguiClientProvider>
      </body>
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_TAG} />
    </html>
  );
}
