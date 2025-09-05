'use client';

import { useLingui } from '@lingui/react';
import { CheckIcon, LanguagesIcon } from 'lucide-react';
import { ComponentProps, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import { Button } from 'src/components/ui/button';
import useChangeLocale from '@/hooks/useChangeLocale';

export default function LanguageButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  const { i18n } = useLingui();
  const { onChangeLocale } = useChangeLocale();

  const locales = useMemo(
    () => [
      {
        locale: 'en',
        label: i18n.t('English'),
      },
      {
        locale: 'ko',
        label: i18n.t('한국어'),
      },
      {
        locale: 'jp',
        label: i18n.t('日本語'),
      },
      {
        locale: 'es',
        label: i18n.t('Español'),
      },
      {
        locale: 'cn',
        label: i18n.t('中文'),
      },
    ],
    [i18n],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={twMerge('cursor-pointer', className)}
          {...props}
        >
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map(({ locale, label }) => {
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => onChangeLocale(locale)}
            >
              <span>{label}</span>
              {i18n.locale === locale && <CheckIcon />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
