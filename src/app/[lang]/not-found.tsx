'use client';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import I18nLink from '@/components/common/I18nLink';
import MainProvider from '@/components/common/MainProvider';
import { Button } from '@/components/ui/button';
import { colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import Image from 'next/image';

export default function NotFound() {
  const { i18n } = useLingui();

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full bg-gray-50">
          <div className="w-25 md:w-50 h-25 md:h-50 relative">
            <Image
              fill
              priority
              src="/404.webp"
              alt={i18n.t('Page not found')}
              sizes="(max-width: 768px) 25vw, 50vw"
              className="object-contain object-center"
            />
          </div>
          <h1 className="text-xl md:text-4xl font-bold">{'404'}</h1>
          <p className="text-lg md:text-xl">{i18n.t('Page not found')}</p>
          <I18nLink href="/">
            <Button
              className={clsx(
                'mt-3 md:mt-5 cursor-pointer',
                colorPresets({ preset: 'gray-light' }),
              )}
            >
              {i18n.t('Go to home')}
            </Button>
          </I18nLink>
        </div>
        <Footer />
      </MainProvider>
    </div>
  );
}
