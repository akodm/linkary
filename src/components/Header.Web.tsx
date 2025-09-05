'use client';

import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Button } from 'src/components/ui/button';
import { CheckIcon } from 'lucide-react';
import { useLingui } from '@lingui/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu';
import useChangeLocale from 'src/components/useChangeLocale';

export default function HeaderWeb({
  className,
  ...props
}: HTMLAttributes<HTMLHeadElement>) {
  const { i18n } = useLingui();
  const { onChangeLocale } = useChangeLocale();

  return (
    <header
      {...props}
      className={clsx('hidden sm:block', 'border-b border-border', className)}
    >
      <div className="flex flex-row justify-between items-center w-full max-w-320 mx-auto p-4">
        <div className="flex flex-row items-center gap-2">
          <span className="font-mono text-base/[1.2] font-medium">
            {'Linkary'}
          </span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">{i18n.t('Select Language')}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onChangeLocale('en')}>
                <span>{i18n.t('English')}</span>
                {i18n.locale === 'en' && <CheckIcon />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeLocale('ko')}>
                <span>{i18n.t('한국어')}</span>
                {i18n.locale === 'ko' && <CheckIcon />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeLocale('jp')}>
                <span>{i18n.t('日本語')}</span>
                {i18n.locale === 'jp' && <CheckIcon />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeLocale('es')}>
                <span>{i18n.t('Español')}</span>
                {i18n.locale === 'es' && <CheckIcon />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangeLocale('cn')}>
                <span>{i18n.t('中文')}</span>
                {i18n.locale === 'cn' && <CheckIcon />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="secondary"
            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          >
            <span>{i18n.t('Sign in')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
