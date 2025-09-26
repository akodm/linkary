'use client';

import { LANGUAGE_KEY } from '@/consts/keys';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function useChangeLocale() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onChangeLocale = useCallback(
    (locale: string) => {
      const [, , ...rest] = pathname.split('/');
      let newHref = `/${locale}/${rest.join('/')}`;

      if (searchParams.size > 0) {
        newHref += `?${searchParams.toString()}`;
      }

      document.cookie = `locale=${locale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;

      window.localStorage.setItem(LANGUAGE_KEY, locale);
      window.location.href = newHref;
    },
    [pathname, searchParams],
  );

  return {
    onChangeLocale,
  };
}
