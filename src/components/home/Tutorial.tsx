'use client';

import { useLingui } from '@lingui/react';
import { AppWindowIcon, BrainCogIcon, ShareIcon } from 'lucide-react';
import { useMemo } from 'react';
import GeneralAnimator from '@/components/common/GeneralAnimator';
import DescriptionStep from '@/components/home/DescriptionStep';
import Section from 'src/components/common/Section';
import Heading from 'src/components/common/Heading';

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
    <Section className="bg-gray-50">
      <Heading>
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
      </Heading>
      <div className="flex flex-col md:flex-row gap-5 w-full max-w-md md:max-w-5xl">
        {tutorialContents.map((content) => {
          return <DescriptionStep key={content.title} {...content} />;
        })}
      </div>
    </Section>
  );
}
