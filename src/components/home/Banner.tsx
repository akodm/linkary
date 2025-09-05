'use client';

import { colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { twMerge } from 'tailwind-merge';

export default function Banner() {
  const { i18n } = useLingui();

  return (
    <section
      id="banner"
      className="flex justify-center items-center w-full h-auto relative"
    >
      <Image
        width={1280}
        height={174}
        src="/main-banner.webp"
        alt={i18n.t('Banner')}
        className="w-full h-auto min-h-178.5 object-cover opacity-60"
      />
      <div className="flex flex-col items-center gap-4 px-2 md:px-4 text-center absolute">
        <h1 className="text-2xl md:text-6xl font-bold">
          <span>{i18n.t('Save links and')}</span>
          <span>&nbsp;</span>
          <span className="text-blue-500">{i18n.t('share them.')}</span>
        </h1>
        <h2 className="text-sm md:text-xl font-medium text-gray-500">
          {i18n.t(
            'A platform to organize and view your important links at a glance',
          )}
        </h2>
        <Button
          size="sm"
          className={twMerge(
            'block md:hidden min-w-40 mt-2 md:mt-5',
            colorPresets({ preset: 'primary' }),
          )}
        >
          {i18n.t('Get started')}
        </Button>
        <Button
          size="lg"
          className={twMerge(
            'hidden md:block md:min-w-80 mt-2 md:mt-5',
            colorPresets({ preset: 'primary' }),
          )}
        >
          {i18n.t('Get started')}
        </Button>
      </div>
    </section>
  );
}
