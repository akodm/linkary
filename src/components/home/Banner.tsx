'use client';

import { colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { ArrowDownIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { twMerge } from 'tailwind-merge';
import I18nLink from 'src/components/common/I18nLink';

export default function Banner() {
  const { i18n } = useLingui();

  return (
    <section className="flex justify-center items-center w-full h-auto bg-white relative">
      <div className="w-full h-auto min-h-178.5 relative">
        <Image
          priority
          fill
          sizes="100vw"
          src="/main-banner.webp"
          alt={i18n.t('Banner')}
          className="w-full h-auto object-cover opacity-60"
        />
      </div>
      <div className="flex flex-col items-center gap-2 md:gap-4 px-4 md:px-6 text-center absolute">
        <h1 className="text-2xl md:text-6xl font-bold">
          <span>{i18n.t('Save links and')}</span>
          <span>&nbsp;</span>
          <span className="text-blue-500">{i18n.t('share them.')}</span>
        </h1>
        <h2
          className={clsx(
            'text-sm md:text-xl font-medium text-gray-500',
            i18n.locale === 'ko' ? 'break-keep' : 'break-words',
          )}
        >
          {i18n.t(
            'A platform to organize and view your important links at a glance',
          )}
        </h2>
        <I18nLink href="/auth" prefetch>
          <Button
            size="sm"
            className={twMerge(
              'block md:hidden min-w-40 mt-2 md:mt-5 cursor-pointer',
              colorPresets({ preset: 'primary' }),
            )}
          >
            {i18n.t('Get started')}
          </Button>
        </I18nLink>
        <I18nLink href="/auth" prefetch>
          <Button
            size="lg"
            className={twMerge(
              'hidden md:block md:min-w-80 mt-2 md:mt-5 cursor-pointer',
              colorPresets({ preset: 'primary' }),
            )}
          >
            {i18n.t('Get started')}
          </Button>
        </I18nLink>
      </div>
      <ArrowDownIcon
        size={15}
        className="text-gray-700 absolute bottom-1 md:bottom-2 animate-bounce"
      />
    </section>
  );
}
