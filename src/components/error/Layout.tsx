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
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ErrorLayout() {
  const [mounted, setMounted] = useState(false);
  const { i18n } = useLingui();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (mounted) {
      const loginFailed = searchParams.get('loginFailed');

      if (loginFailed && loginFailed === 'true') {
        toast(i18n.t('Sign-up or sign-in failed.'), {
          closeButton: true,
          position: 'bottom-right',
        });
      }
    }
  }, [mounted, i18n, searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <div className="flex flex-col justify-center items-center gap-2 w-full h-full bg-gray-50 px-4 text-center">
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
          <h1 className="text-xl md:text-4xl font-bold">
            {i18n.t('Error Page')}
          </h1>
          <p className="text-lg md:text-xl">
            {i18n.t(
              'Something went wrong. If the issue persists, please contact us.',
            )}
          </p>
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
