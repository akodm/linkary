'use client';

import { useLingui } from '@lingui/react';
import Image from 'next/image';
import useI18nRouter from '@/hooks/useI18nRouter';

export default function Logo() {
  const { i18n } = useLingui();
  const { push } = useI18nRouter();

  return (
    <button
      tabIndex={-1}
      className="flex flex-row items-center gap-2 cursor-pointer"
      onClick={() => push('/')}
    >
      <Image
        width={72}
        height={72}
        src="/icons/icon-72x72.png"
        alt={i18n.t('Logo')}
        className="w-9 h-9 md:w-12 md:h-12"
      />
      <span className="font-mono text-sm/[1.2] md:text-base/[1.2] font-medium">
        {'Linkary'}
      </span>
    </button>
  );
}
