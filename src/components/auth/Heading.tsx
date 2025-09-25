'use client';

import { useLingui } from '@lingui/react';
import GeneralAnimator from 'src/components/common/GeneralAnimator';

export default function AuthHeading() {
  const { i18n } = useLingui();

  return (
    <>
      <h1 className="-mt-30 text-2xl font-bold">
        {i18n.t('Sign in to your account')}
      </h1>
      <GeneralAnimator className="mt-3 text-sm md:text-lg font-medium text-gray-500">
        {i18n.t('Sign in to access more features.')}
      </GeneralAnimator>
    </>
  );
}
