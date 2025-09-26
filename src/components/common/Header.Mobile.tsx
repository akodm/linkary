import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import Logo from 'src/components/common/Logo';
import LanguageButton from '@/components/common/LanguageButton';
import { Menu } from '@/components/common/Header.client';
import NavigatorMobile from 'src/components/common/Navigator.Mobile';
import { Session } from 'next-auth';
import UserDropdown from 'src/components/common/UserDropdonw';

export interface HeaderMobileProps extends HTMLAttributes<HTMLHeadElement> {
  isLogo?: boolean;
  isLanguage?: boolean;
  isSignIn?: boolean;
  session?: Session | null;
}

export default function HeaderMobile({
  className,
  isLogo = true,
  isLanguage = true,
  isSignIn = true,
  menus,
  session,
  ...props
}: HeaderMobileProps & { menus: Menu[] }) {
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
        {isLogo && (
          <div className="flex flex-row items-center gap-2 absolute left-4">
            <Logo />
          </div>
        )}
        <div className="flex flex-row items-center gap-2 absolute right-2">
          <NavigatorMobile menus={menus} />
          {isLanguage && <LanguageButton />}
          {isSignIn && <UserDropdown session={session} />}
        </div>
      </div>
    </header>
  );
}
