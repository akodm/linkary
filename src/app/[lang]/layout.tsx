import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/css/globals.css';
import Script from 'next/script';
import { allMessages } from '@/appRouterI18n';
import { LinguiClientProvider } from '@/components/LinguiClientProvider';

const { NEXT_PUBLIC_GA_TAG = '' } = process.env;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Linkary',
  description: 'Linkary is a platform for creating and sharing links.',
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
        </LinguiClientProvider>
      </body>
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_TAG} />
    </html>
  );
}
