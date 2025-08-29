'use client';

import { useEffect, useState } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import I18nLink from 'src/components/I18nLink';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLingui } from '@lingui/react';
import { t } from '@lingui/core/macro';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { i18n } = useLingui();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="flex items-center justify-between p-4">
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Sun /> : <Moon />}
      </button>
      <I18nLink href="/auth">
        <span>{t(i18n)`Move to Auth Page`}</span>
      </I18nLink>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button asChild variant="ghost" size="icon">
            <Menu className="size-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[var(--radix-dropdown-menu-trigger-width)]"
        >
          <DropdownMenuLabel>
            <span>{t(i18n)`Select Language`}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/ko/')}>
            <span>{'Korean'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/en/')}>
            <span>{'English'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/jp/')}>
            <span>{'Japanese'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/cn/')}>
            <span>{'Chinese'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/es/')}>
            <span>{'Spanish'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
