'use client';

import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import Logo from 'src/components/common/Logo';
import { Button } from 'src/components/ui/button';
import LanguageButton from 'src/components/common/LanguageButton';
import { colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import useI18nRouter from '@/hooks/useI18nRouter';

export default function HeaderMobile({
  className,
  ...props
}: HTMLAttributes<HTMLHeadElement>) {
  const { i18n } = useLingui();
  const { push } = useI18nRouter();

  return (
    <header
      {...props}
      className={clsx(
        'block md:hidden',
        'border-b border-border',
        'backdrop-blur-sm bg-white/50 dark:bg-gray-900/50',
        'supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:dark:bg-gray-900/30',
        'sticky top-0 z-50',
        className,
      )}
    >
      <div className="flex flex-row justify-between items-center w-full max-w-320 mx-auto p-4">
        <div className="flex flex-row items-center gap-2">
          <Logo />
        </div>
        <div className="flex flex-row items-center gap-2">
          <LanguageButton size="sm" />
          <Button
            size="sm"
            variant="secondary"
            className={colorPresets({ preset: 'primary' })}
            onClick={() => push('/auth')}
          >
            <span>{i18n.t('Sign in')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
