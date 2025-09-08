'use client';

import { Trans, useLingui } from '@lingui/react';
import { useMemo } from 'react';
import ProvidedFunctionCard from 'src/components/common/ProvidedFunctionCard';

export default function Guest() {
  const { i18n } = useLingui();

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
      },
    ],
    [i18n],
  );

  return (
    <section className="flex flex-col items-center w-full py-10 md:py-20">
      <div className="flex flex-col items-center gap-y-10 md:gap-y-20 w-full max-w-320 px-2 md:px-4 mx-auto">
        <div className="flex flex-col items-center gap-2 md:gap-4 w-full text-center break-keep">
          <h2 className="text-2xl md:text-4xl font-bold">
            <Trans
              id="Log in to access more features."
              message={i18n.t('Log in to access more features.')}
              components={{
                span: <span className="text-blue-500" />,
              }}
            />
          </h2>
          <h3 className="text-sm md:text-lg font-medium text-gray-500">
            {i18n.t(
              'You can use it without signing up, but logging in lets you try more features for free.',
            )}
          </h3>
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
