import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import Script from 'next/script';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Script id="ga-stub" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${NEXT_PUBLIC_GA_TAG}');
          `}
        </Script>
      </body>
      <GoogleAnalytics gaId={NEXT_PUBLIC_GA_TAG} />
    </html>
  );
}
