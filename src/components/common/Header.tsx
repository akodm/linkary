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
        children: [
          {
            title: i18n.t('Project Introduction'),
            href: '/about',
          },
          {
            title: i18n.t('Developer Introduction'),
            href: '/tech',
          },
        ],
      },
      {
        title: i18n.t('Terms and Privacy'),
        children: [
          {
            title: i18n.t('Terms of Service'),
            description: i18n.t(
              'These are the Terms of Service for using the service.',
            ),
            href: '/terms-of-service',
          },
          {
            title: i18n.t('Privacy Policy'),
            description: i18n.t(
              'This is the Privacy Policy regarding the personal information handled by the service.',
            ),
            href: '/privacy',
          },
        ],
      },
      {
        title: i18n.t('FAQ'),
        href: '/faq',
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
