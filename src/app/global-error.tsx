'use client';

import MainProvider from '@/components/common/MainProvider';
import { Button } from '@/components/ui/button';
import { colorPresets } from '@/css/colors';
import * as Sentry from '@sentry/nextjs';
import clsx from 'clsx';
import { ContactIcon, FileCheckIcon, FileUserIcon } from 'lucide-react';
import { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="flex flex-col items-center w-full h-full relative">
          <Header />
          <MainProvider>
            <Content />
            <Footer />
          </MainProvider>
        </div>
      </body>
    </html>
  );
}

const Header = () => {
  const router = useRouter();

  return (
    <header
      className={clsx(
        'flex w-full border-b border-border',
        'backdrop-blur-sm bg-white/50 dark:bg-gray-900/50',
        'supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:dark:bg-gray-900/30',
        'sticky top-0 z-50',
      )}
    >
      <div className="flex flex-row justify-between items-center w-full min-h-20 max-w-320 mx-auto p-4">
        <div className="flex flex-row items-center gap-2 absolute left-4">
          <button
            tabIndex={-1}
            className="flex flex-row items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image
              width={72}
              height={72}
              src="/icons/icon-72x72.png"
              alt={'Logo'}
              className="w-9 h-9 md:w-12 md:h-12"
            />
            <span className="font-mono text-sm/[1.2] md:text-base/[1.2] font-medium">
              {'Linkary'}
            </span>
          </button>
        </div>
        <div className="flex flex-row items-center gap-2 absolute right-4"></div>
      </div>
    </header>
  );
};

const Content = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full h-full bg-gray-50 px-4 text-center">
      <div className="w-25 md:w-50 h-25 md:h-50 relative">
        <Image
          fill
          priority
          src="/404.webp"
          alt={'Error'}
          sizes="(max-width: 768px) 25vw, 50vw"
          className="object-contain object-center"
        />
      </div>
      <h1 className="text-xl md:text-4xl font-bold">{'Error Page'}</h1>
      <p className="text-lg md:text-xl">
        {'Something went wrong. If the issue persists, please contact us.'}
      </p>
      <Link href="/">
        <Button
          className={clsx(
            'mt-3 md:mt-5 cursor-pointer',
            colorPresets({ preset: 'gray-light' }),
          )}
        >
          {'Go to home'}
        </Button>
      </Link>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="flex flex-col items-start md:items-center gap-3 md:gap-5 w-full px-5 py-10 border-t border-border bg-blue-500">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 w-full md:w-fit text-left">
        <span className="mx-auto md:mx-0 text-xs md:text-sm text-gray-300">
          {'© 2025 Linkary. All rights reserved.'}
        </span>
        <div className="flex flex-row items-center gap-x-1.5">
          <FileCheckIcon size={14} className="text-white" />
          <Link href="/terms-of-service">
            <span className="underline text-sm md:text-base text-white hover:text-gray-200 transition-colors duration-200">
              {'Terms of Service'}
            </span>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-x-1.5">
          <FileUserIcon size={14} className="text-white" />
          <Link href="/privacy">
            <span className="underline text-sm md:text-base text-white hover:text-gray-200 transition-colors duration-200">
              {'Privacy Policy'}
            </span>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-x-1.5">
          <ContactIcon size={14} className="text-white" />
          <a
            href="mailto:a8456452@gmail.com"
            className="underline text-sm md:text-base text-white hover:text-gray-200 transition-colors duration-200"
          >
            {'Contact Us'}
          </a>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-x-1.5 mx-auto">
        <span className="text-xs text-gray-300">
          {'Site created by 🤖 akodm'}
        </span>
        <a
          href="https://github.com/akodm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="underline text-xs md:text-sm text-white hover:text-gray-200 transition-colors duration-200">
            {'https://github.com/akodm'}
          </span>
        </a>
      </div>
    </footer>
  );
};
