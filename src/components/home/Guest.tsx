'use client';

import { Trans, useLingui } from '@lingui/react';
import { useMemo } from 'react';
import ProvidedFunctionCard from '@/components/home/ProvidedFunctionCard';
import useI18nRouter from '@/hooks/useI18nRouter';
import clsx from 'clsx';
import GeneralAnimator from '@/components/common/GeneralAnimator';

export default function Guest() {
  const { i18n } = useLingui();
  const { push } = useI18nRouter();

  const functionContents = useMemo(
    () => [
      {
        title: i18n.t('Guest User'),
        description: i18n.t('Start right away without signing up'),
        isGuest: true,
        message: i18n.t('Use as Guest'),
        providedContent: [
          {
            label: i18n.t('Unlimited Link Saving'),
            checked: false,
          },
        ],
        onClick: () => push('/user'),
      },
      {
        title: i18n.t('Member User'),
        description: i18n.t('Access to all features'),
        isGuest: false,
        message: i18n.t('Sign Up'),
        providedContent: [
          {
            label: i18n.t('Unlimited Link Saving'),
            checked: true,
          },
          {
            label: i18n.t('Database Storage'),
            checked: true,
          },
          {
            label: i18n.t('Threat Link Check'),
            checked: true,
          },
          {
            label: i18n.t('AI Link Recommendations'),
            checked: true,
          },
          {
            label: i18n.t('Share Links with the Community'),
            checked: true,
          },
        ],
        onClick: () => push('/auth'),
      },
    ],
    [i18n, push],
  );

  return (
    <section className="flex flex-col items-center w-full py-10 md:py-20 bg-white">
      <div className="flex flex-col items-center gap-y-10 md:gap-y-20 w-full max-w-320 px-4 md:px-6 mx-auto">
        <div
          className={clsx(
            'flex flex-col items-center gap-2 md:gap-4 w-full text-center',
            i18n.locale === 'ko' ? 'break-keep' : 'break-words',
          )}
        >
          <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
            <Trans
              id="Log in to access more features."
              message={i18n.t('Log in to access more features.')}
              components={{
                span: <span className="text-blue-500" />,
              }}
            />
          </GeneralAnimator>
          <GeneralAnimator
            as="h3"
            className="text-sm md:text-lg font-medium text-gray-500"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {i18n.t(
              'You can use it without signing up, but logging in lets you try more features for free.',
            )}
          </GeneralAnimator>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full max-w-md md:max-w-5xl">
          {functionContents.map((content) => {
            return <ProvidedFunctionCard key={content.title} {...content} />;
          })}
        </div>
      </div>
    </section>
  );
}
