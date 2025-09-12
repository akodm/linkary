'use client';

import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Button } from 'src/components/ui/button';
import { useLingui } from '@lingui/react';
import LanguageButton from '@/components/common/LanguageButton.Web';
import { colorPresets } from '@/css/colors';
import Logo from 'src/components/common/Logo';
import useI18nRouter from '@/hooks/useI18nRouter';
import { Menu } from 'src/components/common/Header';
import NavigatorWeb from 'src/components/common/Navigator.Web';
import NavigatorMobile from 'src/components/common/Navigator.Mobile';

export interface HeaderWebProps extends HTMLAttributes<HTMLHeadElement> {
  isLogo?: boolean;
  isLanguage?: boolean;
  isSignIn?: boolean;
  menus: Menu[];
}

export default function HeaderWeb({
  className,
  isLogo = true,
  isLanguage = true,
  isSignIn = true,
  menus,
  ...props
}: HeaderWebProps) {
  const { i18n } = useLingui();
  const { push } = useI18nRouter();

  return (
    <header
      {...props}
      className={clsx(
        'hidden md:block w-full',
        'border-b border-border',
        'backdrop-blur-sm bg-white/50 dark:bg-gray-900/50',
        'supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:dark:bg-gray-900/30',
        'sticky top-0 z-50',
        className,
      )}
    >
      <div className="flex flex-row justify-between items-center w-full min-h-20 max-w-320 mx-auto p-4">
        {isLogo && (
          <div className="flex flex-row items-center gap-2 absolute left-4">
            <Logo />
          </div>
        )}
        <NavigatorWeb menus={menus} />
        <div className="flex flex-row items-center gap-2 absolute right-4">
          <NavigatorMobile menus={menus} />
          {isLanguage && <LanguageButton size="lg" />}
          {isSignIn && (
            <Button
              size="lg"
              variant="secondary"
              className={clsx(
                'cursor-pointer',
                colorPresets({ preset: 'primary' }),
              )}
              onClick={() => push('/auth')}
            >
              <span>{i18n.t('Sign in')}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
