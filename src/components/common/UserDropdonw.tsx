'use client';

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from 'src/components/ui/dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { colorPresets } from '@/css/colors';
import I18nLink from 'src/components/common/I18nLink';
import { UserIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { useMemo } from 'react';
import { signOut } from 'next-auth/react';

interface UserDropdownItem {
  href?: string;
  label: string;
  onClick?: () => void;
}

interface UserDropdownProps {
  session?: Session | null;
}

export default function UserDropdown({ session }: UserDropdownProps) {
  const { i18n } = useLingui();

  const signedUser: UserDropdownItem[] = useMemo(
    () => [
      {
        label: i18n.t('Switch to guest'),
        onClick: () => signOut({ redirectTo: '/user' }),
      },
      {
        label: i18n.t('Logout'),
        onClick: () => signOut({ redirectTo: '/' }),
      },
      {
        href: '/user/delete',
        label: i18n.t('Delete account'),
      },
    ],
    [i18n],
  );
  const unsignedUser: UserDropdownItem[] = useMemo(
    () => [
      {
        href: '/user',
        label: i18n.t('Guest User'),
      },
      {
        href: '/auth',
        label: i18n.t('Sign in'),
      },
    ],
    [i18n],
  );
  const items = useMemo(
    () => (session ? signedUser : unsignedUser),
    [session, signedUser, unsignedUser],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={clsx(
            'size-8 md:size-10 cursor-pointer',
            colorPresets({ preset: 'primary' }),
          )}
        >
          <UserIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        {items.map((item, index) => {
          if (item.href) {
            return (
              <DropdownMenuItem key={index} asChild>
                <I18nLink href={item.href} prefetch className="cursor-pointer">
                  {item.label}
                </I18nLink>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={item.onClick}
              className="cursor-pointer"
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
