'use client';

import { useLingui } from '@lingui/react';
import I18nLink from 'src/components/common/I18nLink';

export default function AuthBottom() {
  const { i18n } = useLingui();

  return (
    <I18nLink href="/user" prefetch>
      <h4 className="text-xs md:text-sm text-gray-400 mt-2 hover:text-gray-500">
        {i18n.t('To continue as a guest, click here.')}
      </h4>
    </I18nLink>
  );
}
