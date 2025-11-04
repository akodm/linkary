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
import { UserIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { useMemo, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { cva, VariantProps } from 'class-variance-authority';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog';
import { deleteUserAction } from '@/lib/actions/user';

const classes = cva('cursor-pointer', {
  variants: {
    color: {
      default: 'text-black',
      primary: 'text-blue-500 hover:text-blue-600!',
      red: 'text-red-500 hover:text-red-600!',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

type UserDropdownItem = {
  label: string;
} & (
  | {
      href: string;
      onClick?: never;
    }
  | {
      href?: never;
      onClick: () => void;
    }
) &
  VariantProps<typeof classes>;

interface UserDropdownProps {
  session?: Session | null;
}

export default function UserDropdown({ session }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const { i18n } = useLingui();

  const signedUser: UserDropdownItem[] = useMemo(
    () => [
      {
        label: i18n.t('Switch to guest'),
        onClick: () => signOut({ redirectTo: '/user' }),
      },
      {
        label: i18n.t('Logout'),
        color: 'red',
        onClick: () => signOut({ redirectTo: '/' }),
      },
      {
        label: i18n.t('Delete account'),
        color: 'red',
        onClick: () => setOpen(true),
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
        color: 'primary',
        label: i18n.t('Sign in'),
      },
    ],
    [i18n],
  );
  const items = useMemo(
    () => (session?.user ? signedUser : unsignedUser),
    [session, signedUser, unsignedUser],
  );

  const onDeleteAccount = async () => {
    await deleteUserAction();
    setOpen(false);
  };

  return (
    <>
      <DropdownMenu modal={false}>
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
                  <Link
                    href={item.href}
                    prefetch
                    className={classes({ color: item.color })}
                  >
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={index}
                onClick={item.onClick}
                className={classes({ color: item.color })}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{i18n.t('Delete account')}</DialogTitle>
            <DialogDescription>
              {i18n.t('Are you sure you want to delete your account?')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{i18n.t('Cancel')}</Button>
            </DialogClose>
            <Button variant="destructive" onClick={onDeleteAccount}>
              {i18n.t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
