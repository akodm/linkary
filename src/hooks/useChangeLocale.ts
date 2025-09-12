'use client';

import { usePathname, useSearchParams } from 'next/navigation';

export default function useChangeLocale() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onChangeLocale = (locale: string) => {
    const [, , ...rest] = pathname.split('/');
    let newHref = `/${locale}/${rest.join('/')}`;

    if (searchParams.size > 0) {
      newHref += `?${searchParams.toString()}`;
    }

    window.location.href = newHref;
  };

  return {
    onChangeLocale,
  };
}
