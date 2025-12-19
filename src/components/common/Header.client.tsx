'use client';

import { useMemo } from 'react';
import { useLingui } from '@lingui/react';
import HeaderWeb, { HeaderWebProps } from 'src/components/common/Header.Web';
import HeaderMobile, {
  HeaderMobileProps,
} from 'src/components/common/Header.Mobile';

export type Menu =
  | {
      title: string;
      description?: string;
      href: string;
      children?: never;
    }
  | {
      title: string;
      description?: string;
      href?: never;
      children: MenuItem[];
    };

export interface MenuItem {
  title: string;
  description?: string;
  href: string;
}

export default function Header(props: HeaderWebProps | HeaderMobileProps) {
  const { i18n } = useLingui();

  const menus: Menu[] = useMemo(
    () => [
      {
        title: i18n.t('Introduction'),
        href: '/about',
      },
      {
        title: i18n.t('FAQ'),
        href: '/faq',
      },
      {
        title: i18n.t('Community'),
        href: '/community',
      },
    ],
    [i18n],
  );

  return (
    <>
      <HeaderWeb {...(props as HeaderWebProps)} menus={menus} />
      <HeaderMobile {...(props as HeaderMobileProps)} menus={menus} />
    </>
  );
}
