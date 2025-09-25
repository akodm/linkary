'use client';

import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import Logo from 'src/components/common/Logo';
import { Button } from 'src/components/ui/button';
import LanguageButton from '@/components/common/LanguageButton.Mobile';
import { colorPresets } from '@/css/colors';
import { useLingui } from '@lingui/react';
import { Menu } from 'src/components/common/Header';
import NavigatorMobile from 'src/components/common/Navigator.Mobile';
import I18nLink from 'src/components/common/I18nLink';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';

export interface HeaderMobileProps extends HTMLAttributes<HTMLHeadElement> {
  isLogo?: boolean;
  isLanguage?: boolean;
  isSignIn?: boolean;
}

export default function HeaderMobile({
  className,
  isLogo = true,
  isLanguage = true,
  isSignIn = true,
  menus,
  ...props
}: HeaderMobileProps & { menus: Menu[] }) {
  const { i18n } = useLingui();

  return (
    <header
      {...props}
      className={clsx(
        'block md:hidden w-full',
        'border-b border-border',
        'backdrop-blur-sm bg-white/50 dark:bg-gray-900/50',
        'supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:dark:bg-gray-900/30',
        'sticky top-0 z-50',
        className,
      )}
    >
      <div className="flex flex-row justify-between items-center w-full min-h-13 max-w-320 p-2">
        <div className="flex flex-row items-center gap-2 absolute left-2">
          {isLogo && <Logo />}
        </div>
        <div className="flex flex-row items-center gap-2 absolute right-2">
          <NavigatorMobile menus={menus} />
          {isLanguage && <LanguageButton size="sm" />}
          {isSignIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  variant="secondary"
                  className={clsx(
                    'cursor-pointer',
                    colorPresets({ preset: 'primary' }),
                  )}
                >
                  <UserIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-2">
                <DropdownMenuItem asChild>
                  <I18nLink href="/user" prefetch className="cursor-pointer">
                    {i18n.t('Guest User')}
                  </I18nLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <I18nLink href="/auth" prefetch className="cursor-pointer">
                    {i18n.t('Sign in')}
                  </I18nLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
