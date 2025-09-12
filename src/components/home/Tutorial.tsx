'use client';

import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { AppWindowIcon, BrainCogIcon, ShareIcon } from 'lucide-react';
import { useMemo } from 'react';
import GeneralAnimator from '@/components/common/GeneralAnimator';
import DescriptionStep from '@/components/home/DescriptionStep';

export default function Tutorial() {
  const { i18n } = useLingui();

  const tutorialContents = useMemo(
    () => [
      {
        title: i18n.t('Install App Shortcut'),
        description: i18n.t(
          'Create a shortcut on your home screen to use it just like an app.',
        ),
        Icon: AppWindowIcon,
      },
      {
        title: i18n.t('AI Link Recommendations'),
        description: i18n.t(
          'Send the content of the links you’d like to receive, and get personalized link suggestions.',
        ),
        Icon: BrainCogIcon,
      },
      {
        title: i18n.t('Share Links with the Community'),
        description: i18n.t('Share your links with other users.'),
        Icon: ShareIcon,
      },
    ],
    [i18n],
  );

  return (
    <section className="flex flex-col items-center w-full py-10 md:py-20 bg-gray-50">
      <div className="flex flex-col items-center gap-y-10 md:gap-y-20 w-full max-w-320 px-4 md:px-6 mx-auto">
        <div
          className={clsx(
            'flex flex-col items-center gap-2 md:gap-4 w-full text-center',
            i18n.locale === 'ko' ? 'break-keep' : 'break-words',
          )}
        >
          <GeneralAnimator as="h2" className="text-2xl md:text-4xl font-bold">
            {i18n.t('Additional Features for Easy Use')}
          </GeneralAnimator>
          <GeneralAnimator
            as="h3"
            className="text-sm md:text-lg font-medium text-gray-500"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {i18n.t(
              'Not only can you add links, but you can also take advantage of various provided features.',
            )}
          </GeneralAnimator>
        </div>
        <div className="flex flex-col md:flex-row gap-5 w-full max-w-md md:max-w-5xl">
          {tutorialContents.map((content) => {
            return <DescriptionStep key={content.title} {...content} />;
          })}
        </div>
      </div>
    </section>
  );
}
