import React, { useMemo } from 'react';
import Link from 'next/link';
import { useLingui } from '@lingui/react';

export default function I18nLink({
  href,
  ...props
}: React.ComponentProps<typeof Link>) {
  const { i18n } = useLingui();
  const parseHref = useMemo(() => {
    if (typeof href === 'string') {
      return `/${i18n.locale}${href}`;
    }

    if (href.pathname) {
      return {
        ...href,
        pathname: `/${i18n.locale}${href.pathname}`,
      };
    }

    return href;
  }, [href, i18n.locale]);

  return <Link {...props} href={parseHref} locale={i18n.locale} />;
}
