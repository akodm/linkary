'use client';

import { Button } from '@/components/ui/button';
import { colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import Image from 'next/image';
import I18nLink from '@/components/common/I18nLink';

export default function NotFoundContent() {
  const { i18n } = useLingui();

  return (
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
  );
}
