'use client';

import clsx from 'clsx';
import { useLingui } from '@lingui/react';
import { HTMLAttributes } from 'react';

export default function Heading({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { i18n } = useLingui();

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-2 md:gap-4 w-full text-center',
        i18n.locale === 'ko' ? 'break-keep' : 'break-words',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
