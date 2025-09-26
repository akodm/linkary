import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import LanguageButton from '@/components/common/LanguageButton';
import Logo from 'src/components/common/Logo';
import { Menu } from '@/components/common/Header.client';
import NavigatorWeb from 'src/components/common/Navigator.Web';
import NavigatorMobile from 'src/components/common/Navigator.Mobile';
import { Session } from 'next-auth';
import UserDropdown from 'src/components/common/UserDropdonw';

export interface HeaderWebProps extends HTMLAttributes<HTMLHeadElement> {
  isLogo?: boolean;
  isLanguage?: boolean;
  isSignIn?: boolean;
  session?: Session | null;
}

export default function HeaderWeb({
  className,
  isLogo = true,
  isLanguage = true,
  isSignIn = true,
  menus,
  session,
  ...props
}: HeaderWebProps & { menus: Menu[] }) {
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
          {isLanguage && <LanguageButton />}
          {isSignIn && <UserDropdown session={session} />}
        </div>
      </div>
    </header>
  );
}
