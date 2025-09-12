'use client';

import { Trans, useLingui } from '@lingui/react';
import { useMemo } from 'react';
import ProvidedFunctionCard from '@/components/home/ProvidedFunctionCard';
import useI18nRouter from '@/hooks/useI18nRouter';
import GeneralAnimator from '@/components/common/GeneralAnimator';
import Section from 'src/components/common/Section';
import Heading from 'src/components/common/Heading';

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
    <Section>
      <Heading>
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
      </Heading>
      <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full max-w-md md:max-w-5xl">
        {functionContents.map((content) => {
          return <ProvidedFunctionCard key={content.title} {...content} />;
        })}
      </div>
    </Section>
  );
}
