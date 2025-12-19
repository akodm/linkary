'use client';

import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { ArrowDownIcon } from 'lucide-react';

export default function Banner() {
  const { i18n } = useLingui();

  return (
    <section className="flex justify-center items-center w-full h-auto bg-white relative">
      <div className="w-full h-auto min-h-80 bg-gray-50 relative" />
      <div className="flex flex-col items-center gap-2 md:gap-4 px-4 md:px-6 text-center absolute">
        <h1 className="text-2xl md:text-6xl font-bold">
          {i18n.t('Community')}
        </h1>
        <h2
          className={clsx(
            'text-sm md:text-xl font-medium text-gray-500',
            i18n.locale === 'ko' ? 'break-keep' : 'break-words',
          )}
        >
          {i18n.t('Explore a variety of verified links.')}
        </h2>
      </div>
      <ArrowDownIcon
        size={15}
        className="text-gray-700 absolute bottom-1 md:bottom-2 animate-bounce"
      />
    </section>
  );
}
